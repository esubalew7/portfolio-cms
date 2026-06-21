import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

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
