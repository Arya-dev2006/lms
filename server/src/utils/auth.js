import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const authCookieName = 'learnsphere_token';

export function signToken(userId) {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

export function setAuthCookie(response, token) {
  response.cookie(authCookieName, token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(response) {
  response.clearCookie(authCookieName, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  });
}
