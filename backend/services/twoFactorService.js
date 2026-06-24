import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import bcrypt from 'bcryptjs';

export const MAX_2FA_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 30 * 60 * 1000;

export function generateTOTPSecret() {
  return speakeasy.generateSecret({
    name: 'Portfolio CMS',
    length: 20,
  });
}

export async function generateQRCodeDataURL(secret, userEmail) {
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.ascii,
    label: `Portfolio CMS (${userEmail})`,
    issuer: 'Portfolio CMS',
    encoding: 'ascii',
  });
  const dataUrl = await qrcode.toDataURL(otpauthUrl);
  return { otpauthUrl, qrCodeDataURL: dataUrl };
}

export function verifyTOTP(secret, token) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'ascii',
    token,
    window: 1,
  });
}

export function generateBackupCodes() {
  const codes = [];
  for (let i = 0; i < 8; i++) {
    const code = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');
    codes.push(`${code.slice(0, 2)}-${code.slice(2)}`);
  }
  return codes;
}

export async function hashRecoveryCodes(codes) {
  return Promise.all(codes.map((code) => bcrypt.hash(code, 10)));
}

export async function verifyRecoveryCode(code, hashedCodes) {
  for (const hash of hashedCodes) {
    if (await bcrypt.compare(code, hash)) {
      return hash;
    }
  }
  return null;
}

export function isAccountLocked(user) {
  if (!user.twoFactorLockedUntil) return false;
  return new Date() < new Date(user.twoFactorLockedUntil);
}
