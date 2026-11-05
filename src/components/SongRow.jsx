import { useState, useEffect } from 'react';
import { getData, saveData, KEYS } from '../utils/localStorage.js';
import { useAuth } from '../context/AuthContext.jsx';
import { SongCard, AlbumCard, ArtistCard, PlaylistCard } from './Cards.jsx';
import { Play, Plus, Download, Share2, Heart, Clock } from 'lucide-react';
import { usePlayer } from '../context/MusicPlayerContext.jsx';
import { useNavigate } from 'react-router-dom';

export function SongRow({ song, index, onPlay, showActions = true, onLike, onDownload, onShare, onAddToPlaylist }) {
  const { currentSong, isPlaying, togglePlay } = usePlayer();
  const navigate = useNavigate();
  const isCurrent = currentSong?.id === song.id;
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!user) return;
    const likedSongs = getData(KEYS.LIKED_SONGS) || {};
    setLiked((likedSongs[user.id] || []).includes(song.id));
  }, [song.id, user]);

  const handleLike = () => {
    const likedSongs = getData(KEYS.LIKED_SONGS) || {};
    const userLiked = likedSongs[user.id] || [];
    let updated;
    if (userLiked.includes(song.id)) {
      updated = userLiked.filter((id) => id !== song.id);
    } else {
      updated = [...userLiked, song.id];
    }
    const data = { ...likedSongs, [user.id]: updated };
    saveData(KEYS.LIKED_SONGS, data);
    setLiked(!liked);
    onLike?.();
  };

  const handlePlay = () => {
    if (isCurrent) togglePlay();
    else onPlay?.(song);
  };

  return (
    <div className={`song-row ${isCurrent ? 'playing' : ''}`}>
      <span className="song-index" onClick={handlePlay}>
        {isCurrent && isPlaying ? '♪' : index + 1}
      </span>
      <img src={song.cover} alt={song.title} onClick={handlePlay} style={{ cursor: 'pointer' }} />
      <div className="song-title-cell" onClick={handlePlay} style={{ cursor: 'pointer' }}>
        <span className="t">{song.title}</span>
        <span className="a" onClick={(e) => { e.stopPropagation(); navigate(`/artist/${song.artistId}`); }}>{song.artist}</span>
      </div>
      <span className="song-cell" onClick={() => navigate(`/album/${song.albumId}`)} style={{ cursor: 'pointer' }}>{song.album}</span>
      <span className="song-cell">{song.genre}</span>
      <span className="song-cell">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
      <div className="song-actions">
        {showActions && (
          <>
            <button onClick={handleLike} title="Like">
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} className={liked ? 'text-primary' : ''} />
            </button>
            {onDownload && <button onClick={() => onDownload(song)} title="Download"><Download size={16} /></button>}
            {onAddToPlaylist && <button onClick={() => onAddToPlaylist(song)} title="Add to playlist"><Plus size={16} /></button>}
            {onShare && <button onClick={() => onShare(song)} title="Share"><Share2 size={16} /></button>}
          </>
        )}
      </div>
    </div>
  );
}

// Re-export cards for convenience
export { SongCard, AlbumCard, ArtistCard, PlaylistCard };
