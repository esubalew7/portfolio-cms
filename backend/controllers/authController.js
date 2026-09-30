// Import User model
import User from "../models/User.js";
import PasswordResetCode from "../models/PasswordResetCode.js";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

// Import jsonwebtoken
import jwt from "jsonwebtoken";

// Import Google auth service
import {
  verifyGoogleToken,
  validateAdminEmail,
  extractGoogleUserInfo,
} from "../services/googleAuthService.js";

import { createNotification } from "../services/notificationService.js";
import { emitProfileUpdate } from "../socket/emitters.js";
import { sendPasswordResetCode } from "../services/emailService.js";


// ========================================
// @desc    Register new admin (optional)
// @route   POST /api/auth/register
// @access  Public (you can disable later)
// ========================================
// Controller signature is intentionally (req, res) only.
// We do not use next() here because this is not error-handling middleware.
export const register = async (req, res) => {
    try {
        // Get data from request body
        const { email, password } = req.body;

        // -------------------------------
        // VALIDATION
        // -------------------------------
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Trim and lowercase email for consistency
        const normalizedEmail = email.trim().toLowerCase();

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

        // Password length validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        // Check if user already exists (case-insensitive)
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // -------------------------------
        // CREATE USER
        // -------------------------------
        const user = await User.create({
            email: normalizedEmail,
            password, // will be hashed automatically in model
        });

        // -------------------------------
        // RESPONSE
        // -------------------------------
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                email: user.email,
                createdAt: user.createdAt,
            },
        });

    } catch (error) {
        // No next() call here; errors are returned directly in the response.
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        });
    }
};


// ── Cookie helpers ──────────────────────────────────────────
const TOKEN_COOKIE = 'token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true, // secure: true ensures cookies are sent over HTTPS only
  sameSite: 'none', // sameSite: 'none' used to allow cross-site cookies for Google OAuth in production
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matches JWT expiry)
};

const setTokenCookie = (res, token) => {
  res.cookie(TOKEN_COOKIE, token, COOKIE_OPTIONS);
};

const clearTokenCookie = (res) => {
  res.cookie(TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 0,
  });
};
// ─────────────────────────────────────────────────────────────

// ========================================
// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
// ========================================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // -------------------------------
        // VALIDATION
        // -------------------------------
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // ✅ FIX: normalize email (same as register)
        const normalizedEmail = email.trim().toLowerCase();

        // -------------------------------
        // FIND USER
        // -------------------------------
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        // -------------------------------
        // COMPARE PASSWORD
        // -------------------------------
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password",
            });
        }

        // -------------------------------
        // TWO-FACTOR AUTHENTICATION CHECK
        // -------------------------------
        if (user.twoFactorEnabled) {
            const tempToken = jwt.sign(
              { id: user._id, purpose: '2fa' },
              process.env.JWT_SECRET,
              { expiresIn: '5m' }
            );

            return res.status(200).json({
              success: true,
              requiresTwoFactor: true,
              tempToken,
              message: '2FA verification required',
            });
        }

        // -------------------------------
        // GENERATE TOKEN
        // -------------------------------
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set HttpOnly cookie (secure, SameSite=Lax)
        setTokenCookie(res, token);

        // -------------------------------
        // RESPONSE
        // -------------------------------
        res.status(200).json({
            success: true,
            message: "Login successful",
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

const passwordResetCodeHash = (email, code) => createHmac('sha256', process.env.JWT_SECRET)
  .update(`${email}:${code}`)
  .digest('hex');

export const requestPasswordReset = async (req, res) => {
  const genericResponse = {
    success: true,
    message: 'If this email is authorized, a reset code has been sent.',
  };

  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!email || !adminEmail || email !== adminEmail || !process.env.JWT_SECRET) {
      return res.status(200).json(genericResponse);
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(200).json(genericResponse);

    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await PasswordResetCode.findOneAndUpdate(
      { email },
      { codeHash: passwordResetCodeHash(email, code), attempts: 0, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    try {
      await sendPasswordResetCode(email, code);
    } catch (mailError) {
      await PasswordResetCode.deleteOne({ email });
      throw mailError;
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error('Password reset email error:', error.message);
    return res.status(503).json({
      success: false,
      message: 'Unable to send a reset code right now. Check the server email configuration and try again.',
    });
  }
};

export const resetPasswordWithCode = async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const code = typeof req.body.code === 'string' ? req.body.code.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!email || email !== adminEmail || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset code.' });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
      });
    }

    const resetRecord = await PasswordResetCode.findOne({ email });
    if (!resetRecord || resetRecord.expiresAt <= new Date() || resetRecord.attempts >= 5) {
      if (resetRecord) await PasswordResetCode.deleteOne({ _id: resetRecord._id });
      return res.status(400).json({ success: false, message: 'Invalid or expired reset code.' });
    }

    const submittedHash = Buffer.from(passwordResetCodeHash(email, code), 'hex');
    const storedHash = Buffer.from(resetRecord.codeHash, 'hex');
    const codeMatches = submittedHash.length === storedHash.length && timingSafeEqual(submittedHash, storedHash);
    if (!codeMatches) {
      resetRecord.attempts += 1;
      if (resetRecord.attempts >= 5) await resetRecord.deleteOne();
      else await resetRecord.save();
      return res.status(400).json({ success: false, message: 'Invalid or expired reset code.' });
    }

    const consumed = await PasswordResetCode.findOneAndDelete({ _id: resetRecord._id, codeHash: resetRecord.codeHash });
    if (!consumed) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset code.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset code.' });

    user.password = password;
    user.passwordChangedAt = new Date();
    await user.save();
    clearTokenCookie(res);

    return res.status(200).json({ success: true, message: 'Password reset successfully. You can now sign in.' });
  } catch (error) {
    console.error('Password reset error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to reset the password right now.' });
  }
};

// ========================================
// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
// ========================================
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential token is required',
      });
    }

    // Verify Google token server-side
    const payload = await verifyGoogleToken(credential);

    // Extract email and validate against ADMIN_EMAIL
    const email = validateAdminEmail(payload.email);

    // Extract user info for reference
    const googleUser = extractGoogleUserInfo(payload);

    // Find existing user or create one for this admin email
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        // No password set — this user authenticates via Google only
      });
    }

    // ── Two-Factor Authentication check ──────────────────────
    if (user.twoFactorEnabled) {
      // Generate short-lived temporary token for 2FA verification
      const tempToken = jwt.sign(
        { id: user._id, purpose: '2fa' },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );

      return res.status(200).json({
        success: true,
        requiresTwoFactor: true,
        tempToken,
        message: '2FA verification required',
      });
    }

    // Generate the same JWT as email/password login
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HttpOnly cookie (secure, SameSite=Lax)
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);

    // Distinguish error types:
    // 400 — bad request (missing credential)
    // 403 — forbidden (Google account not authorized)
    // 500 — server error (config issues, unexpected failures)
    let statusCode = 500;

    if (error.message.includes('credential token is required')) {
      statusCode = 400;
    } else if (error.message.includes('Access Denied')) {
      statusCode = 403;
    } else if (
      error.message.includes('not configured') ||
      error.message.includes('No email')
    ) {
      statusCode = 500;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
// ========================================
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// ========================================
// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
// ========================================
export const updateProfile = async (req, res) => {
  try {
    const { name, role, email } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (role !== undefined) updates.role = role;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    emitProfileUpdate(user);

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ========================================
// @desc    Upload profile image
// @route   POST /api/auth/profile/image
// @access  Private
// ========================================
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: req.file.path },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    emitProfileUpdate(user);

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ========================================
// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
// ========================================
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Password login is not configured for this account. Use Google authentication.",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const samePassword = await user.comparePassword(newPassword);
    if (samePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as your current password",
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    clearTokenCookie(res);

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    console.log(`[AUDIT] Password changed | User: ${user.email} | Time: ${new Date().toISOString()} | IP: ${ip} | UA: ${userAgent}`);

    try {
      await createNotification({
        type: 'content',
        title: 'Security Alert',
        description: 'Password changed successfully.',
        message: `Your admin password was changed. IP: ${ip}`,
      });
    } catch (notifErr) {
      console.error('Failed to create notification:', notifErr);
    }

    res.status(200).json({
      success: true,
      message: "Password changed successfully. Please login again.",
    });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
};

// ========================================
// @desc    Logout admin (clear cookie)
// @route   POST /api/auth/logout
// @access  Public
// ========================================
export const logout = async (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};