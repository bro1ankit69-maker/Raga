import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function AlbumCard({ album, onPlay }) {
  const navigate = useNavigate();
  return (
    <div className="album-card" onClick={() => navigate(`/album/${album.id}`)}>
      <img src={album.cover} alt={album.title} className="card-image" loading="lazy" />
      <div className="card-play-btn" onClick={(e) => { e.stopPropagation(); onPlay?.(album); }}>
        <Play size={20} fill="black" />
      </div>
      <div className="card-title">{album.title}</div>
      <div className="card-subtitle">{album.artist}</div>
    </div>
  );
}
