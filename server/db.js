import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

// Cache the connection so serverless invocations (Vercel) reuse it
const cached = globalThis._mongoose || (globalThis._mongoose = { conn: null, promise: null, seeded: false });

export async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  if (!cached.seeded) {
    await seedDemoUsers();
    cached.seeded = true;
  }
  return cached.conn;
}

// Creates the demo accounts shown on the login page (passwords are stored hashed)
async function seedDemoUsers() {
  const demos = [
    { _id: 'admin-demo', name: 'Admin', email: 'admin@ragaplay.com', password: 'admin123', role: 'admin', country: 'United States', dob: '1990-01-01' },
    { _id: 'user-demo', name: 'Demo User', email: 'user@ragaplay.com', password: 'user123', role: 'user', country: 'United States', dob: '1995-05-15' },
  ];
  for (const d of demos) {
    const exists = await User.exists({ email: d.email });
    if (!exists) await User.create({ ...d, password: await bcrypt.hash(d.password, 10) });
  }
}
