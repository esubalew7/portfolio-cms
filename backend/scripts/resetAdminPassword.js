import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const readSecret = (prompt) => new Promise((resolve, reject) => {
  const input = process.stdin;

  if (!input.isTTY || typeof input.setRawMode !== 'function') {
    reject(new Error('Run this command from an interactive terminal.'));
    return;
  }

  process.stdout.write(prompt);
  input.setEncoding('utf8');
  input.setRawMode(true);
  input.resume();

  let value = '';
  const finish = (error) => {
    input.removeListener('data', onData);
    input.setRawMode(false);
    input.pause();
    process.stdout.write('\n');
    if (error) reject(error);
    else resolve(value);
  };

  const onData = (character) => {
    if (character === '\u0003') {
      finish(new Error('Password reset cancelled.'));
    } else if (character === '\r' || character === '\n') {
      finish();
    } else if (character === '\u007f' || character === '\b') {
      value = value.slice(0, -1);
    } else if (character >= ' ') {
      value += character;
    }
  };

  input.on('data', onData);
});

const run = async () => {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail || !process.env.MONGO_URI) {
    throw new Error('ADMIN_EMAIL and MONGO_URI must be configured in backend/.env.');
  }

  const newPassword = await readSecret('New password: ');
  const confirmation = await readSecret('Confirm new password: ');

  if (newPassword !== confirmation) {
    throw new Error('The passwords do not match.');
  }

  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;
  if (!strongPassword.test(newPassword)) {
    throw new Error('Use at least 8 characters with uppercase, lowercase, a number, and a special character.');
  }

  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: adminEmail });
  if (!user) {
    throw new Error('No user exists for the configured ADMIN_EMAIL.');
  }

  user.password = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();
  console.log('Admin password updated.');
};

try {
  await run();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}