import { usePlayer } from '../context/MusicPlayerContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
  Volume2, Heart, Volume1, VolumeX,
} from 'lucide-react';
import { getData, saveData, KEYS } from '../utils/localStorage.js';
import { useState, useEffect } from 'react';

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function MusicPlayer() {
  const {
    currentSong, isPlaying, progress, duration, volume, shuffle, repeat, demoMode,
    togglePlay, next, prev, seek, setVolume, setShuffle, setRepeat,
  } = usePlayer();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);

  // Check if current song is liked
  useEffect(() => {
    if (!currentSong || !user) return;
    const likedSongs = getData(KEYS.LIKED_SONGS) || {};
    setLiked((likedSongs[user.id] || []).includes(currentSong.id));
  }, [currentSong, user]);

  if (!currentSong) {
    return (
      <div className="music-player">
        <div className="empty-state" style={{ margin: '0 auto', padding: 0 }}>
          <p className="text-secondary text-sm">Select a song to start playing</p>
        </div>
      </div>
    );
  }

  const toggleLike = () => {
    if (!user) return;
    const likedSongs = getData(KEYS.LIKED_SONGS) || {};
    const userLiked = likedSongs[user.id] || [];
    let updated;
    if (userLiked.includes(currentSong.id)) {
      updated = userLiked.filter((id) => id !== currentSong.id);
    } else {
      updated = [...userLiked, currentSong.id];
    }
    saveData(KEYS.LIKED_SONGS, { ...likedSongs, [user.id]: updated });
    setLiked(!liked);
  };

  const dur = demoMode ? currentSong.duration : duration;
  const VolIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="music-player">
      <div className="player-current">
        <img src={currentSong.cover} alt={currentSong.title} />
        <div className="player-current-info">
          <div className="title">{currentSong.title}</div>
          <div className="artist">{currentSong.artist}</div>
        </div>
        <button className="player-btn" onClick={toggleLike} style={{ marginLeft: '0.5rem' }}>
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} className={liked ? 'text-primary' : ''} />
        </button>
      </div>

      <div className="player-controls">
        <div className="player-buttons">
          <button className={`player-btn ${shuffle ? 'active' : ''}`} onClick={() => setShuffle(!shuffle)}>
            <Shuffle size={18} />
          </button>
          <button className="player-btn" onClick={prev}><SkipBack size={20} fill="currentColor" /></button>
          <button className="player-btn play" onClick={togglePlay}>
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button className="player-btn" onClick={next}><SkipForward size={20} fill="currentColor" /></button>
          <button
            className={`player-btn ${repeat !== 'off' ? 'active' : ''}`}
            onClick={() => setRepeat(repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off')}
          >
            {repeat === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
          </button>
          {demoMode && <span className="player-demo-badge">DEMO</span>}
        </div>
        <div className="player-progress">
          <span className="player-time">{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={dur || 100}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
          />
          <span className="player-time">{formatTime(dur)}</span>
        </div>
      </div>

      <div className="player-volume">
        <VolIcon size={20} className="player-btn" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
