import { useNavigate } from 'react-router-dom';

export default function ArtistCard({ artist }) {
  const navigate = useNavigate();
  return (
    <div className="artist-card" onClick={() => navigate(`/artist/${artist.id}`)}>
      <img src={artist.image} alt={artist.name} className="card-image" loading="lazy" />
      <div className="card-title">{artist.name}</div>
      <div className="card-subtitle">{artist.genre}</div>
    </div>
  );
}
