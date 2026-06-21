import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  generateTOTPSecret,
  generateQRCodeDataURL,
  verifyTOTP,
} from '../services/twoFactorService.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const TEMP_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 5 * 60 * 1000,
};

// POST /api/auth/2fa/setup
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
    const { qrCodeDataURL, otpauthUrl } = await generateQRCodeDataURL(
      secret,
      user.email
    );

    user.twoFactorSecret = secret.ascii;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        secret: secret.ascii,
        qrCode: qrCodeDataURL,
        otpauthUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// POST /api/auth/2fa/verify-setup
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

    const secret = user.twoFactorSecret;
    if (!secret) {
      return res.status(400).json({
        success: false,
        message: 'No 2FA secret found. Please start setup again.',
      });
    }

    const isValid = verifyTOTP(secret, token);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid code. Please try again.' });
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA has been enabled successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// POST /api/auth/2fa/disable
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
    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA has been disabled successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// POST /api/auth/2fa/verify-login
export const verifyLogin2FA = async (req, res) => {
  try {
    const { tempToken, token } = req.body;

    if (!tempToken) {
      return res.status(400).json({ success: false, message: 'Temporary token required' });
    }

    if (!token || !/^\d{6}$/.test(token)) {
      return res.status(400).json({ success: false, message: 'Valid 6-digit code required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Temporary token expired or invalid. Please login again.',
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

    const isValid = verifyTOTP(user.twoFactorSecret, token);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid code. Please try again.' });
    }

    const fullToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', fullToken, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: '2FA verification successful',
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
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET /api/auth/2fa/status
export const get2FAStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('twoFactorEnabled');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
