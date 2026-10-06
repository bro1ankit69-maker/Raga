import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getData, KEYS, saveData } from '../utils/localStorage.js';
import { useAuth } from '../context/AuthContext.jsx';
import { usePlayer } from '../context/MusicPlayerContext.jsx';
import { SongRow } from '../components/SongRow.jsx';
import Modal from '../components/Modal.jsx';
import { Play, Heart, Plus, Download, Share2 } from 'lucide-react';

export default function Album() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const albums = getData(KEYS.ALBUMS) || [];
    const al = albums.find((a) => a.id === id);
    if (!al) { navigate('/home'); return; }
    setAlbum(al);
    const allSongs = getData(KEYS.SONGS) || [];
    setSongs(al.songIds.map((sid) => allSongs.find((s) => s.id === sid)).filter(Boolean));
    setAllPlaylists((getData(KEYS.PLAYLISTS) || []).filter((p) => p.ownerId === user?.id));
  }, [id, user]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const playAlbum = () => {
    if (songs.length === 0) return;
    playSong(songs[0], songs);
  };

  const addToPlaylist = (playlistId) => {
    const playlists = getData(KEYS.PLAYLISTS) || [];
    const updated = playlists.map((p) =>
      p.id === playlistId && !p.songIds.includes(selectedSong.id)
        ? { ...p, songIds: [...p.songIds, selectedSong.id] }
        : p
    );
    saveData(KEYS.PLAYLISTS, updated);
    setShowPlaylistModal(false);
    showToast(`Added to playlist`);
  };

  const downloadSong = (song) => {
    const downloads = getData(KEYS.DOWNLOADS) || {};
    const userDownloads = downloads[user.id] || [];
    if (userDownloads.some((d) => d.songId === song.id)) { showToast('Already downloaded'); return; }
    saveData(KEYS.DOWNLOADS, {
      ...downloads,
      [user.id]: [...userDownloads, { songId: song.id, downloadedAt: new Date().toISOString() }],
    });
    showToast(`Downloaded "${song.title}"`);
  };

  const shareSong = (song) => {
    navigator.clipboard?.writeText(`https://ragaplay.app/song/${song.id}`);
    showToast('Song link copied!');
  };

  return (
    <div>
      <div className="detail-header">
        <img src={album?.cover} alt={album?.title} />
        <div className="detail-info">
          <div className="label">Album</div>
          <h1>{album?.title}</h1>
          <div className="meta">{album?.artist} · {album?.year} · {album?.genre} · {songs.length} songs</div>
        </div>
      </div>

      <div className="detail-actions">
        <button className="btn btn-primary btn-lg" onClick={playAlbum} disabled={songs.length === 0}>
          <Play size={20} fill="black" /> Play
        </button>
        <button className="btn btn-ghost" onClick={() => showToast('Album liked!')}>
          <Heart size={18} /> Like
        </button>
        <button className="btn btn-ghost" onClick={() => {
          navigator.clipboard?.writeText(`https://ragaplay.app/album/${id}`);
          showToast('Album link copied!');
        }}>
          <Share2 size={18} /> Share
        </button>
      </div>

      <div className="song-list">
        <div className="song-list-header">
          <span>#</span><span></span><span>Title</span><span>Album</span><span>Genre</span><span>Duration</span><span></span>
        </div>
        {songs.map((song, i) => (
          <SongRow
            key={song.id}
            song={song}
            index={i}
            onPlay={(s) => playSong(s, songs)}
            onDownload={downloadSong}
            onShare={shareSong}
            onAddToPlaylist={(s) => { setSelectedSong(s); setShowPlaylistModal(true); }}
          />
        ))}
      </div>

      {showPlaylistModal && (
        <Modal title="Add to Playlist" onClose={() => setShowPlaylistModal(false)}>
          {allPlaylists.length === 0 ? (
            <p className="text-secondary">Create a playlist first</p>
          ) : (
            allPlaylists.map((pl) => (
              <div key={pl.id} className="sidebar-link" onClick={() => addToPlaylist(pl.id)}>
                <Plus size={18} /> {pl.name}
              </div>
            ))
          )}
        </Modal>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
