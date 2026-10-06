import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData, KEYS } from '../utils/localStorage.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Playlists() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const all = getData(KEYS.PLAYLISTS) || [];
    setPlaylists(all.filter((p) => p.ownerId === user?.id || p.privacy === 'Public'));
  }, [user]);

  return (
    <div>
      <h1 className="page-title">Playlists</h1>
      <div className="card-grid cols-5">
        {playlists.map((p) => (
          <div key={p.id} className="playlist-card" onClick={() => navigate(`/playlist/${p.id}`)}>
            <img src={p.cover} alt={p.name} className="card-image" loading="lazy" />
            <div className="card-title">{p.name}</div>
            <div className="card-subtitle">{p.songIds.length} songs · {p.privacy}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
