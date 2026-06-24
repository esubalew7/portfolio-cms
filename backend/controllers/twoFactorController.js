import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  generateTOTPSecret,
  generateQRCodeDataURL,
  verifyTOTP,
  generateBackupCodes,
  hashRecoveryCodes,
  verifyRecoveryCode,
  isAccountLocked,
  MAX_2FA_ATTEMPTS,
  LOCKOUT_DURATION_MS,
} from '../services/twoFactorService.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const RECOVERY_CODE_REGEX = /^\d{2}-\d{2}$/;

// ── Helpers ──────────────────────────────────────────────────

function issueFullJwt(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function issueTempToken(userId) {
  return jwt.sign(
    { id: userId, purpose: '2fa' },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );
}

function userPublicData(user) {
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    profileImage: user.profileImage,
    twoFactorEnabled: user.twoFactorEnabled,
  };
}

function isRecoveryCodeInput(token) {
  return RECOVERY_CODE_REGEX.test(token);
}

// ── POST /api/auth/2fa/setup ────────────────────────────────
export const setup2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ success: false, message: '2FA is already enabled' });
    }

    const secret = generateTOTPSecret();
    const { qrCodeDataURL, otpauthUrl } = await generateQRCodeDataURL(secret, user.email);

    const recoveryCodes = generateBackupCodes();
    const hashedCodes = await hashRecoveryCodes(recoveryCodes);

    user.twoFactorSecret = secret.ascii;
    user.recoveryCodes = hashedCodes;
    user.twoFactorAttempts = 0;
    user.twoFactorLockedUntil = null;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        secret: secret.ascii,
        qrCode: qrCodeDataURL,
        otpauthUrl,
        recoveryCodes,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── POST /api/auth/2fa/verify-setup ─────────────────────────
export const verifySetup2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ success: false, message: '2FA is already enabled' });
    }

    const { token } = req.body;
    if (!token || !/^\d{6}$/.test(token)) {
      return res.status(400).json({ success: false, message: 'Valid 6-digit code required' });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: 'No 2FA secret found. Please start setup again.',
      });
    }

    const isValid = verifyTOTP(user.twoFactorSecret, token);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid code. Please try again.' });
    }

    user.twoFactorEnabled = true;
    user.last2FAVerifiedAt = new Date();
    user.twoFactorAttempts = 0;
    user.twoFactorLockedUntil = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA has been enabled successfully',
      data: { recoveryCodesCount: user.recoveryCodes.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── POST /api/auth/2fa/disable ──────────────────────────────
export const disable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ success: false, message: '2FA is not enabled' });
    }

    const { token } = req.body;
    if (!token || !/^\d{6}$/.test(token)) {
      return res.status(400).json({ success: false, message: 'Valid 6-digit code required' });
    }

    const isValid = verifyTOTP(user.twoFactorSecret, token);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid code. Please try again.' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = '';
    user.recoveryCodes = [];
    user.last2FAVerifiedAt = null;
    user.twoFactorAttempts = 0;
    user.twoFactorLockedUntil = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA has been disabled successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── POST /api/auth/2fa/verify-login ─────────────────────────
export const verifyLogin2FA = async (req, res) => {
  try {
    const { tempToken, token } = req.body;

    if (!tempToken) {
      return res.status(400).json({ success: false, message: 'Temporary token required' });
    }

    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification code required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please login again.',
      });
    }

    if (decoded.purpose !== '2fa') {
      return res.status(401).json({ success: false, message: 'Invalid token purpose' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ success: false, message: '2FA is not enabled for this account' });
    }

    // ── Account lockout check ──
    if (isAccountLocked(user)) {
      const remaining = Math.ceil((new Date(user.twoFactorLockedUntil) - new Date()) / 60000);
      return res.status(429).json({
        success: false,
        message: `Account temporarily locked. Try again in ${remaining} minute(s).`,
        lockedUntil: user.twoFactorLockedUntil,
      });
    }

    let verified = false;

    // Try TOTP (6-digit code)
    if (/^\d{6}$/.test(token)) {
      verified = verifyTOTP(user.twoFactorSecret, token);
    }

    // Try recovery code (XX-XX format)
    if (!verified && isRecoveryCodeInput(token)) {
      const matchedHash = await verifyRecoveryCode(token, user.recoveryCodes);
      if (matchedHash) {
        user.recoveryCodes = user.recoveryCodes.filter((h) => h !== matchedHash);
        verified = true;
      }
    }

    if (!verified) {
      user.twoFactorAttempts = (user.twoFactorAttempts || 0) + 1;

      if (user.twoFactorAttempts >= MAX_2FA_ATTEMPTS) {
        user.twoFactorLockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
        await user.save();
        return res.status(429).json({
          success: false,
          message: `Too many failed attempts. Account locked for 30 minutes.`,
          lockedUntil: user.twoFactorLockedUntil,
        });
      }

      const remaining = MAX_2FA_ATTEMPTS - user.twoFactorAttempts;
      await user.save();
      return res.status(400).json({
        success: false,
        message: `Invalid code. ${remaining} attempt(s) remaining.`,
      });
    }

    // ── Success ──
    user.twoFactorAttempts = 0;
    user.twoFactorLockedUntil = null;
    user.last2FAVerifiedAt = new Date();
    await user.save();

    const fullToken = issueFullJwt(user._id);
    res.cookie('token', fullToken, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: '2FA verification successful',
      data: userPublicData(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── GET /api/auth/2fa/status ────────────────────────────────
export const get2FAStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      'twoFactorEnabled recoveryCodes last2FAVerifiedAt twoFactorAttempts twoFactorLockedUntil'
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        twoFactorEnabled: user.twoFactorEnabled,
        recoveryCodesCount: user.recoveryCodes?.length || 0,
        last2FAVerifiedAt: user.last2FAVerifiedAt,
        twoFactorAttempts: user.twoFactorAttempts || 0,
        isLocked: isAccountLocked(user),
        lockedUntil: user.twoFactorLockedUntil,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── POST /api/auth/2fa/recovery-codes/regenerate ────────────
export const regenerateRecoveryCodes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ success: false, message: '2FA is not enabled' });
    }

    const { token } = req.body;
    if (!token || !/^\d{6}$/.test(token)) {
      return res.status(400).json({ success: false, message: 'Valid 6-digit code required' });
    }

    const isValid = verifyTOTP(user.twoFactorSecret, token);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid code. Please try again.' });
    }

    const recoveryCodes = generateBackupCodes();
    const hashedCodes = await hashRecoveryCodes(recoveryCodes);
    user.recoveryCodes = hashedCodes;
    await user.save();

    res.status(200).json({
      success: true,
      data: { recoveryCodes },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
