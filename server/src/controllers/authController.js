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

export async function updateProfile(request, response, next) {
  try {
    const { name, email } = request.body;
    if (typeof name !== 'string' || name.trim().length < 2) {
      return response.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return response.status(400).json({ success: false, message: 'Enter a valid email address' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const duplicate = await User.exists({ email: normalizedEmail, _id: { $ne: request.user._id } });
    if (duplicate) return response.status(409).json({ success: false, message: 'An account with this email already exists' });
    const user = await User.findByIdAndUpdate(
      request.user._id,
      { name: name.trim(), email: normalizedEmail },
      { new: true, runValidators: true },
    );
    return response.json({ success: true, user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

export async function changePassword(request, response, next) {
  try {
    const { currentPassword, newPassword, confirmPassword } = request.body;
    if (!currentPassword || typeof newPassword !== 'string' || newPassword.length < 8 || newPassword !== confirmPassword) {
      return response.status(400).json({ success: false, message: 'Provide a matching password of at least 8 characters' });
    }
    const user = await User.findById(request.user._id).select('+password');
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) return response.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    return response.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    return next(error);
  }
}
