import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User, { toPublicUser } from '../models/User.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', async (req, res) => {
  const { name, email, password, country = '', dob = '' } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Please fill in all fields' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const exists = await User.exists({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ error: 'Email already registered' });

  const user = await User.create({ name, email, country, dob, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ token: signToken(user), user: toPublicUser(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const user = await User.findOne({ email: email.toLowerCase() });
  const ok = user && (await bcrypt.compare(password, user.password));
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' });
  if (user.status === 'deactivated') return res.status(403).json({ error: 'Account deactivated' });

  res.json({ token: signToken(user), user: toPublicUser(user) });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ error: 'User no longer exists' });
  res.json({ user: toPublicUser(user) });
});

router.patch('/me', requireAuth, async (req, res) => {
  const { name, country, dob } = req.body || {};
  const updates = {};
  if (name) updates.name = name;
  if (country !== undefined) updates.country = country;
  if (dob !== undefined) updates.dob = dob;
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: toPublicUser(user) });
});

export default router;
