import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { clearAuthCookie, setAuthCookie, signToken } from '../utils/auth.js';

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export async function register(request, response, next) {
  try {
    const { name, email, password, confirmPassword } = request.body;
    if (
      typeof name !== 'string'
      || typeof email !== 'string'
      || typeof password !== 'string'
      || typeof confirmPassword !== 'string'
      || password !== confirmPassword
    ) {
      return response.status(400).json({ success: false, message: 'Provide matching registration details' });
    }
    if (password.length < 8) {
      return response.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.exists({ email: normalizedEmail });
    if (existingUser) {
      return response.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
    setAuthCookie(response, signToken(user._id.toString()));
    return response.status(201).json({ success: true, user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() }).select('+password');
    const validPassword = user && user.isActive ? await bcrypt.compare(password || '', user.password) : false;
    if (!validPassword) {
      return response.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    setAuthCookie(response, signToken(user._id.toString()));
    return response.json({ success: true, user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

export function logout(_request, response) {
  clearAuthCookie(response);
  return response.json({ success: true, message: 'Logged out successfully' });
}

export function getMe(request, response) {
  return response.json({ success: true, user: publicUser(request.user) });
}
