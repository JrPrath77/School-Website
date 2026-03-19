/**
 * Seed script to create the initial admin user.
 * Run: node seed/seed-admin.js
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

import Admin from '../models/Admin.js';

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existing = await Admin.findOne({ username: 'admin' });
    if (existing) {
      console.log('ℹ️  Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash('admin123', 10);

    await Admin.create({
      username: 'admin',
      email: 'admin@dagaeducation.com',
      passwordHash,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   ⚠️  CHANGE THIS PASSWORD after first login!');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
