import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify a Google credential token and return the payload.
 * Throws if the token is invalid.
 */
export const verifyGoogleToken = async (credentialToken) => {
  if (!credentialToken) {
    throw new Error('Google credential token is required');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credentialToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error('Failed to get Google user payload');
  }

  return payload;
};

/**
 * Validate that the authenticated Google user's email matches the configured admin email.
 */
export const validateAdminEmail = (email) => {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL is not configured on the server');
  }

  if (!email) {
    throw new Error('No email provided from Google authentication');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedAdmin = adminEmail.trim().toLowerCase();

  if (normalizedEmail !== normalizedAdmin) {
    throw new Error('Access Denied. This Google account is not authorized to access the admin dashboard.');
  }

  return normalizedEmail;
};

/**
 * Extract user info from Google payload for response/logging.
 */
export const extractGoogleUserInfo = (payload) => ({
  googleId: payload.sub,
  email: payload.email,
  name: payload.name,
  picture: payload.picture,
  emailVerified: payload.email_verified,
});
