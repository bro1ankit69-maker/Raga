import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getData, KEYS, saveData } from '../utils/localStorage.js';
import { useAuth } from '../context/AuthContext.jsx';
import { usePlayer } from '../context/MusicPlayerContext.jsx';
import { SongRow } from '../components/SongRow.jsx';
import AlbumCard from '../components/AlbumCard.jsx';
import ArtistCard from '../components/ArtistCard.jsx';
import { Play, UserPlus, UserCheck } from 'lucide-react';

export default function Artist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [related, setRelated] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const artists = getData(KEYS.ARTISTS) || [];
    const a = artists.find((ar) => ar.id === id);
    if (!a) { navigate('/home'); return; }
    setArtist(a);
    const allSongs = getData(KEYS.SONGS) || [];
    const artistSongs = allSongs.filter((s) => s.artistId === id);
    setSongs(artistSongs);
    const allAlbums = getData(KEYS.ALBUMS) || [];
    setAlbums(allAlbums.filter((al) => al.artistId === id));
    setRelated(artists.filter((ar) => ar.genre === a.genre && ar.id !== id).slice(0, 5));

    const followed = getData(KEYS.FOLLOWED_ARTISTS) || {};
    setIsFollowing((followed[user?.id] || []).includes(id));
  }, [id, user]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const toggleFollow = () => {
    const followed = getData(KEYS.FOLLOWED_ARTISTS) || {};
    const userFollowed = followed[user.id] || [];
    let updated;
    if (isFollowing) {
      updated = userFollowed.filter((fid) => fid !== id);
      // Decrement followers
      const artists = getData(KEYS.ARTISTS) || [];
      saveData(KEYS.ARTISTS, artists.map((a) => a.id === id ? { ...a, followers: a.followers - 1 } : a));
      showToast('Unfollowed');
    } else {
      updated = [...userFollowed, id];
      const artists = getData(KEYS.ARTISTS) || [];
      saveData(KEYS.ARTISTS, artists.map((a) => a.id === id ? { ...a, followers: a.followers + 1 } : a));
      showToast('Following!');
    }
    saveData(KEYS.FOLLOWED_ARTISTS, { ...followed, [user.id]: updated });
    setIsFollowing(!isFollowing);
    setArtist({ ...artist, followers: artist.followers + (isFollowing ? -1 : 1) });
  };

  const playArtist = () => {
    if (songs.length === 0) return;
    playSong(songs[0], songs);
  };

  const formatFollowers = (n) => n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n.toString();

  return (
    <div>
      <div className="detail-header" style={{ alignItems: 'center' }}>
        <img src={artist?.image} alt={artist?.name} style={{ borderRadius: '50%' }} />
        <div className="detail-info">
          <div className="label">Artist</div>
          <h1>{artist?.name}</h1>
          <div className="meta">{artist?.genre} · {formatFollowers(artist?.followers || 0)} followers</div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '600px' }}>{artist?.bio}</p>
        </div>
      </div>

      <div className="detail-actions">
        <button className="btn btn-primary btn-lg" onClick={playArtist} disabled={songs.length === 0}>
          <Play size={20} fill="black" /> Play
        </button>
        <button className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`} onClick={toggleFollow}>
          {isFollowing ? <><UserCheck size={18} /> Following</> : <><UserPlus size={18} /> Follow</>}
        </button>
      </div>

      <section className="page-section">
        <h2 className="section-title mb-2">Popular Songs</h2>
        <div className="song-list">
          <div className="song-list-header">
            <span>#</span><span></span><span>Title</span><span>Album</span><span>Genre</span><span>Duration</span><span></span>
          </div>
          {songs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} onPlay={(s) => playSong(s, songs)} />
          ))}
        </div>
      </section>

      {albums.length > 0 && (
        <section className="page-section">
          <h2 className="section-title mb-2">Albums</h2>
          <div className="card-grid cols-5">
            {albums.map((a) => <AlbumCard key={a.id} album={a} />)}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="page-section">
          <h2 className="section-title mb-2">Related Artists</h2>
          <div className="card-grid cols-5">
            {related.map((a) => <ArtistCard key={a.id} artist={a} />)}
          </div>
        </section>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
