// Import User model
import User from "../models/User.js";

// Import jsonwebtoken
import jwt from "jsonwebtoken";

// Import Google auth service
import {
  verifyGoogleToken,
  validateAdminEmail,
  extractGoogleUserInfo,
} from "../services/googleAuthService.js";


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

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
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