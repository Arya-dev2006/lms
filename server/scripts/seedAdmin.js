import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import { config, loadEnvironment } from '../src/config/env.js';

async function seedAdmin() {
  loadEnvironment();
  if (!config.admin.email || !config.admin.password || !config.admin.name) {
    throw new Error('ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be set before seeding');
  }
  if (config.admin.password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters');
  }

  await mongoose.connect(config.mongoUri);
  const email = config.admin.email.trim().toLowerCase();
  const password = await bcrypt.hash(config.admin.password, 12);
  const admin = await User.findOneAndUpdate(
    { email },
    { $set: { name: config.admin.name.trim(), password, role: 'admin', isActive: true } },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
  );
  console.log(`Admin account ready: ${admin.email}`);
  await mongoose.disconnect();
}

seedAdmin().catch(async (error) => {
  console.error('Unable to seed admin:', error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
