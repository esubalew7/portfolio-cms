import express from 'express';
import {
  setup2FA,
  verifySetup2FA,
  disable2FA,
  verifyLogin2FA,
  get2FAStatus,
  regenerateRecoveryCodes,
} from '../controllers/twoFactorController.js';
import protect from '../middleware/authMiddleware.js';
import { twoFactorLimiter, setupLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/status', protect, get2FAStatus);
router.post('/setup', protect, setupLimiter, setup2FA);
router.post('/verify-setup', protect, setupLimiter, verifySetup2FA);
router.post('/disable', protect, twoFactorLimiter, disable2FA);
router.post('/verify-login', twoFactorLimiter, verifyLogin2FA);
router.post('/recovery-codes/regenerate', protect, twoFactorLimiter, regenerateRecoveryCodes);

export default router;
