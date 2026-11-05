import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function PlaylistCard({ playlist, onPlay }) {
  const navigate = useNavigate();
  return (
    <div className="playlist-card" onClick={() => navigate(`/playlist/${playlist.id}`)}>
      <img src={playlist.cover} alt={playlist.name} className="card-image" loading="lazy" />
      <div className="card-play-btn" onClick={(e) => { e.stopPropagation(); onPlay?.(playlist); }}>
        <Play size={20} fill="black" />
      </div>
      <div className="card-title">{playlist.name}</div>
      <div className="card-subtitle">{playlist.description || 'Playlist'}</div>
    </div>
  );
}
