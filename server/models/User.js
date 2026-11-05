import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // bcrypt hash, never plain text
    country: { type: String, default: '' },
    dob: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'deactivated'], default: 'active' },
  },
  { timestamps: true }
);

export function toPublicUser(u) {
  return { id: u._id, name: u.name, email: u.email, role: u.role, country: u.country, dob: u.dob };
}

export default mongoose.models.User || mongoose.model('User', userSchema);
