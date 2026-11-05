import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getData, KEYS, saveData, genId } from '../utils/localStorage.js';
import { useAuth } from '../context/AuthContext.jsx';
import { usePlayer } from '../context/MusicPlayerContext.jsx';
import { SongRow } from '../components/SongRow.jsx';
import Modal from '../components/Modal.jsx';
import { Play, Heart, Plus, Share2, Edit2, Trash2, Download } from 'lucide-react';

export default function Playlist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', privacy: 'Public' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadPlaylist();
  }, [id]);

  const loadPlaylist = () => {
    const playlists = getData(KEYS.PLAYLISTS) || [];
    const pl = playlists.find((p) => p.id === id);
    if (!pl) { navigate('/library'); return; }
    setPlaylist(pl);
    setEditForm({ name: pl.name, description: pl.description || '', privacy: pl.privacy });
    const allSongsData = getData(KEYS.SONGS) || [];
    setAllSongs(allSongsData);
    setSongs(pl.songIds.map((sid) => allSongsData.find((s) => s.id === sid)).filter(Boolean));
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const playPlaylist = () => {
    if (songs.length === 0) return;
    playSong(songs[0], songs);
  };

  const addSong = (song) => {
    const playlists = getData(KEYS.PLAYLISTS) || [];
    const updated = playlists.map((p) =>
      p.id === id ? { ...p, songIds: [...p.songIds, song.id] } : p
    );
    saveData(KEYS.PLAYLISTS, updated);
    setShowAddModal(false);
    loadPlaylist();
    showToast(`Added "${song.title}" to playlist`);
  };

  const removeSong = (songId) => {
    const playlists = getData(KEYS.PLAYLISTS) || [];
    const updated = playlists.map((p) =>
      p.id === id ? { ...p, songIds: p.songIds.filter((sid) => sid !== songId) } : p
    );
    saveData(KEYS.PLAYLISTS, updated);
    loadPlaylist();
  };

  const saveEdit = () => {
    const playlists = getData(KEYS.PLAYLISTS) || [];
    const updated = playlists.map((p) =>
      p.id === id ? { ...p, ...editForm } : p
    );
    saveData(KEYS.PLAYLISTS, updated);
    setShowEditModal(false);
    loadPlaylist();
    showToast('Playlist updated');
  };

  const deletePlaylist = () => {
    if (!confirm('Delete this playlist?')) return;
    const playlists = getData(KEYS.PLAYLISTS) || [];
    saveData(KEYS.PLAYLISTS, playlists.filter((p) => p.id !== id));
    navigate('/library');
  };

  const downloadSong = (song) => {
    const downloads = getData(KEYS.DOWNLOADS) || {};
    const userDownloads = downloads[user.id] || [];
    if (userDownloads.some((d) => d.songId === song.id)) {
      showToast('Already downloaded');
      return;
    }
    saveData(KEYS.DOWNLOADS, {
      ...downloads,
      [user.id]: [...userDownloads, { songId: song.id, downloadedAt: new Date().toISOString() }],
    });
    showToast(`Downloaded "${song.title}"`);
  };

  const isOwner = playlist?.ownerId === user?.id;

  return (
    <div>
      <div className="detail-header">
        <img src={playlist?.cover} alt={playlist?.name} />
        <div className="detail-info">
          <div className="label">Playlist</div>
          <h1>{playlist?.name}</h1>
          <div className="meta">{playlist?.description} · {songs.length} songs · {playlist?.privacy}</div>
        </div>
      </div>

      <div className="detail-actions">
        <button className="btn btn-primary btn-lg" onClick={playPlaylist} disabled={songs.length === 0}>
          <Play size={20} fill="black" /> Play
        </button>
        {isOwner && (
          <>
            <button className="btn btn-secondary" onClick={() => setShowAddModal(true)}>
              <Plus size={18} /> Add Songs
            </button>
            <button className="btn btn-ghost" onClick={() => setShowEditModal(true)}>
              <Edit2 size={18} /> Edit
            </button>
            <button className="btn btn-ghost" onClick={deletePlaylist}>
              <Trash2 size={18} /> Delete
            </button>
          </>
        )}
        <button className="btn btn-ghost" onClick={() => setShowShareModal(true)}>
          <Share2 size={18} /> Share
        </button>
      </div>

      {songs.length === 0 ? (
        <div className="empty-state">
          <h3>No songs in this playlist yet</h3>
          <p>{isOwner ? 'Click "Add Songs" to get started' : 'Check back later'}</p>
        </div>
      ) : (
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
              onAddToPlaylist={(s) => { /* already in playlist */ }}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <Modal title="Add Songs to Playlist" onClose={() => setShowAddModal(false)}>
          <div className="song-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {allSongs
              .filter((s) => !playlist.songIds.includes(s.id))
              .map((song, i) => (
                <div key={song.id} className="song-row" onClick={() => addSong(song)}>
                  <span className="song-index">{i + 1}</span>
                  <img src={song.cover} alt={song.title} />
                  <div className="song-title-cell">
                    <span className="t">{song.title}</span>
                    <span className="a">{song.artist}</span>
                  </div>
                  <span className="song-cell">{song.album}</span>
                  <span className="song-cell">{song.genre}</span>
                  <span className="song-cell">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                  <div className="song-actions"><Plus size={16} /></div>
                </div>
              ))}
          </div>
        </Modal>
      )}

      {showEditModal && (
        <Modal title="Edit Playlist" onClose={() => setShowEditModal(false)}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Privacy</label>
            <select className="form-select" value={editForm.privacy} onChange={(e) => setEditForm({ ...editForm, privacy: e.target.value })}>
              <option>Public</option><option>Private</option>
            </select>
          </div>
          <button className="btn btn-primary btn-full" onClick={saveEdit}>Save Changes</button>
        </Modal>
      )}

      {showShareModal && (
        <Modal title="Share Playlist" onClose={() => setShowShareModal(false)}>
          <p className="mb-2 text-secondary">{playlist?.name}</p>
          <div className="form-group">
            <label className="form-label">Shareable Link</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input className="form-input" readOnly value={`https://ragaplay.app/playlist/${id}`} />
              <button className="btn btn-primary" onClick={() => {
                navigator.clipboard?.writeText(`https://ragaplay.app/playlist/${id}`);
                showToast('Link copied!');
              }}>Copy</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => showToast('Shared on Twitter!')}>Twitter</button>
            <button className="btn btn-secondary" onClick={() => showToast('Shared on Facebook!')}>Facebook</button>
            <button className="btn btn-secondary" onClick={() => showToast('Shared on WhatsApp!')}>WhatsApp</button>
          </div>
        </Modal>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
