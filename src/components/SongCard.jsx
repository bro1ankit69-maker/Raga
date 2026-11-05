import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function SongCard({ song, onPlay }) {
  const navigate = useNavigate();
  return (
    <div className="song-card" onClick={() => onPlay?.(song)}>
      <img src={song.cover} alt={song.title} className="card-image" loading="lazy" />
      <div className="card-play-btn" onClick={(e) => { e.stopPropagation(); onPlay?.(song); }}>
        <Play size={20} fill="black" />
      </div>
      <div className="card-title">{song.title}</div>
      <div className="card-subtitle" onClick={(e) => { e.stopPropagation(); navigate(`/artist/${song.artistId}`); }}>{song.artist}</div>
    </div>
  );
}
