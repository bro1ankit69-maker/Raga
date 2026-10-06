import { useState, useEffect } from 'react';
import { getData, saveData, KEYS } from '../utils/localStorage.js';
import { Star, StarOff } from 'lucide-react';

export default function FeaturedContent() {
  const [featured, setFeatured] = useState({ songs: [], albums: [], artists: [], trending: [] });
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [tab, setTab] = useState('songs');
  const [toast, setToast] = useState('');

  useEffect(() => {
    setFeatured(getData(KEYS.FEATURED) || { songs: [], albums: [], artists: [], trending: [] });
    setSongs(getData(KEYS.SONGS) || []);
    setAlbums(getData(KEYS.ALBUMS) || []);
    setArtists(getData(KEYS.ARTISTS) || []);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const toggleFeatured = (type, id) => {
    const current = featured[type] || [];
    const updated = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    const newFeatured = { ...featured, [type]: updated };
    saveData(KEYS.FEATURED, newFeatured);
    setFeatured(newFeatured);
    showToast(updated.includes(id) ? 'Marked as featured' : 'Removed from featured');
  };

  const tabs = [
    { key: 'songs', label: 'Featured Songs' },
    { key: 'trending', label: 'Trending' },
    { key: 'albums', label: 'Featured Albums' },
    { key: 'artists', label: 'Featured Artists' },
  ];

  return (
    <div>
      <h1 className="page-title">Featured Content</h1>
      <p className="text-secondary mb-3">Mark content as featured or trending to highlight it on the user home page.</p>

      <div className="search-filters">
        {tabs.map((t) => (
          <button key={t.key} className={`filter-chip ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'songs' && (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Title</th><th>Artist</th><th>Genre</th><th>Featured</th></tr></thead>
            <tbody>
              {songs.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td><td>{s.artist}</td><td>{s.genre}</td>
                  <td>
                    <button className="player-btn" onClick={() => toggleFeatured('songs', s.id)}>
                      {featured.songs?.includes(s.id) ? <Star size={18} fill="currentColor" className="text-primary" /> : <StarOff size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'trending' && (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Title</th><th>Artist</th><th>Plays</th><th>Trending</th></tr></thead>
            <tbody>
              {songs.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td><td>{s.artist}</td><td>{(s.plays || 0).toLocaleString()}</td>
                  <td>
                    <button className="player-btn" onClick={() => toggleFeatured('trending', s.id)}>
                      {featured.trending?.includes(s.id) ? <Star size={18} fill="currentColor" className="text-primary" /> : <StarOff size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'albums' && (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Title</th><th>Artist</th><th>Genre</th><th>Featured</th></tr></thead>
            <tbody>
              {albums.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td><td>{a.artist}</td><td>{a.genre}</td>
                  <td>
                    <button className="player-btn" onClick={() => toggleFeatured('albums', a.id)}>
                      {featured.albums?.includes(a.id) ? <Star size={18} fill="currentColor" className="text-primary" /> : <StarOff size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'artists' && (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Genre</th><th>Followers</th><th>Featured</th></tr></thead>
            <tbody>
              {artists.map((a) => (
                <tr key={a.id}>
                  <td>{a.name}</td><td>{a.genre}</td><td>{(a.followers || 0).toLocaleString()}</td>
                  <td>
                    <button className="player-btn" onClick={() => toggleFeatured('artists', a.id)}>
                      {featured.artists?.includes(a.id) ? <Star size={18} fill="currentColor" className="text-primary" /> : <StarOff size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
