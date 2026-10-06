import { useState, useEffect } from 'react';
import { getData, KEYS } from '../utils/localStorage.js';
import { useAuth } from '../context/AuthContext.jsx';
import { usePlayer } from '../context/MusicPlayerContext.jsx';
import { SongRow } from '../components/SongRow.jsx';
import { Heart } from 'lucide-react';

export default function LikedSongs() {
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const likedSongs = getData(KEYS.LIKED_SONGS) || {};
    const userLiked = likedSongs[user?.id] || [];
    const allSongs = getData(KEYS.SONGS) || [];
    setSongs(userLiked.map((id) => allSongs.find((s) => s.id === id)).filter(Boolean));
  }, [user]);

  return (
    <div>
      <div className="detail-header" style={{ background: 'linear-gradient(135deg, #535bf233, transparent)' }}>
        <div style={{
          width: '200px', height: '200px', borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, #535bf2, #1db954)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Heart size={80} fill="white" color="white" />
        </div>
        <div className="detail-info">
          <div className="label">Playlist</div>
          <h1>Liked Songs</h1>
          <div className="meta">{songs.length} songs</div>
        </div>
      </div>

      <div className="detail-actions">
        <button className="btn btn-primary btn-lg" disabled={songs.length === 0}
          onClick={() => playSong(songs[0], songs)}>
          Play
        </button>
      </div>

      {songs.length === 0 ? (
        <div className="empty-state">
          <Heart size={48} />
          <h3>No liked songs yet</h3>
          <p>Like songs by clicking the heart icon</p>
        </div>
      ) : (
        <div className="song-list">
          <div className="song-list-header">
            <span>#</span><span></span><span>Title</span><span>Album</span><span>Genre</span><span>Duration</span><span></span>
          </div>
          {songs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} onPlay={(s) => playSong(s, songs)} />
          ))}
        </div>
      )}
    </div>
  );
}
