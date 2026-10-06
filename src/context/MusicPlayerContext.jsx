import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { getData, saveData, KEYS } from '../utils/localStorage.js';
import { useAuth } from './AuthContext.jsx';

const MusicPlayerContext = createContext(null);

export function MusicPlayerProvider({ children }) {
  const { user } = useAuth();
  const audioRef = useRef(new Audio());

  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off'); // off | all | one
  const [demoMode, setDemoMode] = useState(false);

  const audio = audioRef.current;

  useEffect(() => {
    audio.volume = volume;
  }, [volume, audio]);

  // Record recently played
  const recordPlay = useCallback((song) => {
    if (!user) return;
    const recent = getData(KEYS.RECENTLY_PLAYED) || {};
    const userRecent = recent[user.id] || [];
    const filtered = userRecent.filter((r) => r.songId !== song.id);
    const updated = [{ songId: song.id, playedAt: new Date().toISOString() }, ...filtered].slice(0, 20);
    saveData(KEYS.RECENTLY_PLAYED, { ...recent, [user.id]: updated });

    // Increment play count
    const songs = getData(KEYS.SONGS) || [];
    saveData(KEYS.SONGS, songs.map((s) => (s.id === song.id ? { ...s, plays: s.plays + 1 } : s)));
  }, [user]);

  const playSong = useCallback((song, songQueue) => {
    const q = songQueue || [song];
    const idx = q.findIndex((s) => s.id === song.id);
    setQueue(q);
    setQueueIndex(idx >= 0 ? idx : 0);
    setCurrentSong(song);
    setProgress(0);

    if (song.audioUrl) {
      setDemoMode(false);
      audio.src = song.audioUrl;
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
      });
    } else {
      setDemoMode(true);
      audio.pause();
      audio.src = '';
      setIsPlaying(true);
    }
    recordPlay(song);
  }, [audio, recordPlay]);

  const togglePlay = useCallback(() => {
    if (!currentSong) return;
    if (demoMode) {
      setIsPlaying((p) => !p);
      return;
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [audio, currentSong, isPlaying, demoMode]);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    let nextIdx;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (queueIndex < queue.length - 1) {
      nextIdx = queueIndex + 1;
    } else if (repeat === 'all') {
      nextIdx = 0;
    } else {
      setIsPlaying(false);
      return;
    }
    setQueueIndex(nextIdx);
    const song = queue[nextIdx];
    setCurrentSong(song);
    setProgress(0);
    if (song.audioUrl) {
      setDemoMode(false);
      audio.src = song.audioUrl;
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      setDemoMode(true);
      setIsPlaying(true);
    }
    recordPlay(song);
  }, [queue, queueIndex, shuffle, repeat, audio, recordPlay]);

  const prev = useCallback(() => {
    if (queue.length === 0) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const prevIdx = queueIndex > 0 ? queueIndex - 1 : queue.length - 1;
    setQueueIndex(prevIdx);
    const song = queue[prevIdx];
    setCurrentSong(song);
    setProgress(0);
    if (song.audioUrl) {
      setDemoMode(false);
      audio.src = song.audioUrl;
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      setDemoMode(true);
      setIsPlaying(true);
    }
    recordPlay(song);
  }, [queue, queueIndex, audio, recordPlay]);

  const seek = useCallback((time) => {
    if (!demoMode) {
      audio.currentTime = time;
      setProgress(time);
    }
  }, [audio, demoMode]);

  // Audio event listeners
  useEffect(() => {
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audio, repeat, next]);

  // Demo mode progress simulation
  useEffect(() => {
    if (!demoMode || !isPlaying || !currentSong) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        const dur = currentSong.duration || 200;
        if (p >= dur) {
          if (repeat === 'one') return 0;
          next();
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [demoMode, isPlaying, currentSong, repeat, next]);

  return (
    <MusicPlayerContext.Provider value={{
      currentSong, queue, queueIndex, isPlaying, progress, duration, volume,
      shuffle, repeat, demoMode,
      playSong, togglePlay, next, prev, seek, setVolume, setShuffle, setRepeat,
    }}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within MusicPlayerProvider');
  return ctx;
}
