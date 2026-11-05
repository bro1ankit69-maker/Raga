import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Third-party API: Apple iTunes Search API (free, no API key).
// Called from the server so the browser never talks to iTunes directly.
router.get('/search', requireAuth, async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json({ results: [] });

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=24`;
  const response = await fetch(url);
  if (!response.ok) return res.status(502).json({ error: 'Music service unavailable' });
  const data = await response.json();

  const results = (data.results || [])
    .filter((t) => t.previewUrl)
    .map((t) => ({
      id: `it-${t.trackId}`,
      title: t.trackName,
      artist: t.artistName,
      album: t.collectionName,
      genre: t.primaryGenreName,
      year: t.releaseDate ? new Date(t.releaseDate).getFullYear() : undefined,
      cover: (t.artworkUrl100 || '').replace('100x100', '400x400'),
      audioUrl: t.previewUrl, // 30-second preview
      duration: 30,
      source: 'itunes',
    }));

  res.json({ results });
});

export default router;
