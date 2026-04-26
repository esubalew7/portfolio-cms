import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const createAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    const email = 'admin@test.com';
    const password = 'password123';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists. Updating password...');
      existingUser.password = password;
      await existingUser.save();
      console.log('User updated successfully.');
    } else {
      console.log('Creating user...');
      await User.create({ email, password });
      console.log('User created successfully.');
    }

    console.log('\n--- Credentials ---');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('-------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
