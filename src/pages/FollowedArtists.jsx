import { useState, useEffect } from 'react';
import { getData, KEYS, saveData } from '../utils/localStorage.js';
import { useAuth } from '../context/AuthContext.jsx';
import ArtistCard from '../components/ArtistCard.jsx';
import { UserPlus, UserCheck } from 'lucide-react';

export default function FollowedArtists() {
  const { user } = useAuth();
  const [artists, setArtists] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const followed = getData(KEYS.FOLLOWED_ARTISTS) || {};
    const userFollowed = followed[user?.id] || [];
    const allArtists = getData(KEYS.ARTISTS) || [];
    setArtists(userFollowed.map((id) => allArtists.find((a) => a.id === id)).filter(Boolean));
  }, [user]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const unfollow = (artistId) => {
    const followed = getData(KEYS.FOLLOWED_ARTISTS) || {};
    const userFollowed = followed[user.id] || [];
    saveData(KEYS.FOLLOWED_ARTISTS, {
      ...followed,
      [user.id]: userFollowed.filter((id) => id !== artistId),
    });
    setArtists(artists.filter((a) => a.id !== artistId));
    showToast('Unfollowed');
  };

  return (
    <div>
      <h1 className="page-title">Followed Artists</h1>

      {artists.length === 0 ? (
        <div className="empty-state">
          <UserPlus size={48} />
          <h3>You're not following any artists</h3>
          <p>Follow artists to see them here and get updates</p>
        </div>
      ) : (
        <div className="card-grid cols-5">
          {artists.map((a) => (
            <div key={a.id} className="artist-card">
              <img src={a.image} alt={a.name} className="card-image" loading="lazy" />
              <div className="card-title">{a.name}</div>
              <div className="card-subtitle">{a.genre}</div>
              <button className="btn btn-secondary btn-full mt-2" onClick={() => unfollow(a.id)}>
                <UserCheck size={16} /> Unfollow
              </button>
            </div>
          ))}
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
