import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });

import User from './models/user.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Đã kết nối tới MongoDB');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin đã tồn tại:', existingAdmin.email);
      console.log('Bỏ qua — chỉ có 1 admin được phép.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    const admin = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
    });

    console.log('Tạo Admin thành công!');
    console.log('Email:', admin.email);
    console.log('Password:', process.env.ADMIN_PASSWORD);
    process.exit(0);
  } catch (err) {
    console.error('Lỗi:', err);
    process.exit(1);
  }
};

seedAdmin();