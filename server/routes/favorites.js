import { Router } from 'express';
import Favorite from '../models/Favorite.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const toSong = (f) => ({
  id: f.trackId, title: f.title, artist: f.artist, album: f.album, cover: f.cover,
  audioUrl: f.audioUrl, genre: f.genre, duration: f.duration, source: 'itunes',
});

router.get('/', async (req, res) => {
  const favs = await Favorite.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ favorites: favs.map(toSong) });
});

router.post('/', async (req, res) => {
  const s = req.body || {};
  if (!s.id || !s.title) return res.status(400).json({ error: 'Invalid song' });
  const doc = await Favorite.findOneAndUpdate(
    { userId: req.user.id, trackId: s.id },
    { title: s.title, artist: s.artist, album: s.album, cover: s.cover, audioUrl: s.audioUrl, genre: s.genre, duration: s.duration },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.status(201).json({ favorite: toSong(doc) });
});

router.delete('/:trackId', async (req, res) => {
  await Favorite.deleteOne({ userId: req.user.id, trackId: req.params.trackId });
  res.json({ ok: true });
});

export default router;
