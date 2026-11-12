import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authCookieName } from '../utils/auth.js';
import { config } from '../config/env.js';

export async function protect(request, response, next) {
  try {
    const token = request.cookies[authCookieName];
    if (!token) {
      return response.status(401).json({ success: false, message: 'Authentication required' });
    }

    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.userId).select('-password');
    if (!user || !user.isActive) {
      return response.status(401).json({ success: false, message: 'Account is unavailable' });
    }

    request.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return response.status(401).json({ success: false, message: 'Invalid or expired session' });
    }
    return next(error);
  }
}

export function requireRole(...roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({ success: false, message: 'You do not have permission' });
    }
    return next();
  };
}
