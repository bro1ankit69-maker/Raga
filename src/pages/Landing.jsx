import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getData, KEYS } from '../utils/localStorage.js';
import { Music, Play, Search, Heart, Download, ListMusic, Compass, Share2 } from 'lucide-react';
import { seedData } from '../utils/seedData.js';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => { seedData(); }, []);

  const genres = getData(KEYS.GENRES) || [];
  const artists = (getData(KEYS.ARTISTS) || []).slice(0, 6);
  const songs = (getData(KEYS.SONGS) || []).slice(0, 6);

  const features = [
    { icon: <Search />, title: 'Smart Search', desc: 'Find songs, albums, artists, and playlists instantly.' },
    { icon: <Heart />, title: 'Personalized', desc: 'Get recommendations based on your listening habits.' },
    { icon: <ListMusic />, title: 'Create Playlists', desc: 'Build and share your own music collections.' },
    { icon: <Download />, title: 'Offline Mode', desc: 'Download songs and listen without internet.' },
    { icon: <Compass />, title: 'Discover New', desc: 'Explore genres and find your next favorite artist.' },
    { icon: <Share2 />, title: 'Share Music', desc: 'Share your playlists with friends and family.' },
  ];

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-logo">
          <span className="logo-icon"><Music size={22} /></span>
          RagaPlay
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
        </div>
      </nav>

      <section className="landing-hero">
        <p className="tagline">Your music. Your mood. Your flow.</p>
        <h1>Listen Without Limits</h1>
        <p>
          Stream millions of songs, create personalized playlists, discover new artists,
          and take your music everywhere. RagaPlay brings the world of music to your fingertips.
        </p>
        <div className="landing-hero-buttons">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
            <Play size={20} fill="black" /> Get Started Free
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </section>

      <section className="landing-section">
        <h2>Featured Genres</h2>
        <div className="card-grid cols-5">
          {genres.map((g) => (
            <Link to="/discover" key={g.id}>
              <div className="genre-card" style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color}99)` }}>
                {g.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <h2>Popular Artists</h2>
        <div className="card-grid cols-5">
          {artists.map((a) => (
            <div key={a.id} className="artist-card">
              <img src={a.image} alt={a.name} className="card-image" loading="lazy" />
              <div className="card-title">{a.name}</div>
              <div className="card-subtitle">{a.genre}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <h2>Popular Songs</h2>
        <div className="card-grid cols-5">
          {songs.map((s) => (
            <div key={s.id} className="song-card">
              <img src={s.cover} alt={s.title} className="card-image" loading="lazy" />
              <div className="card-title">{s.title}</div>
              <div className="card-subtitle">{s.artist}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <h2>Why RagaPlay?</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-logo" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
          <span className="logo-icon"><Music size={20} /></span>
          RagaPlay
        </div>
        <p>Your music. Your mood. Your flow.</p>
        <p style={{ marginTop: '0.5rem' }}>© 2024 RagaPlay. A college project demonstration.</p>
      </footer>
    </div>
  );
}
