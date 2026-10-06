import { useState, useEffect } from 'react';
import { getData, saveData, KEYS, genId } from '../utils/localStorage.js';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/Modal.jsx';

const EMPTY = { title: '', artistId: '', genre: 'Pop', year: 2024, cover: '' };

export default function ManageAlbums() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    loadAlbums();
    setArtists(getData(KEYS.ARTISTS) || []);
    setSongs(getData(KEYS.SONGS) || []);
  }, []);

  const loadAlbums = () => setAlbums(getData(KEYS.ALBUMS) || []);
  const genres = ['Pop', 'Rock', 'Hip Hop', 'EDM', 'Jazz', 'Classical', 'Lo-Fi', 'Bollywood', 'Indie', 'R&B'];

  const filtered = albums.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) || a.artist.toLowerCase().includes(query.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (album) => { setForm({ ...album }); setEditing(album.id); };

  const save = () => {
    if (!form.title.trim()) return;
    const artist = artists.find((a) => a.id === form.artistId);
    const albumData = {
      ...form,
      artist: artist?.name || '',
      year: Number(form.year),
      cover: form.cover || `https://picsum.photos/seed/${form.title}/400/400`,
      songIds: form.songIds || [],
    };
    if (editing === 'new') {
      const newAlbum = { ...albumData, id: genId() };
      saveData(KEYS.ALBUMS, [...albums, newAlbum]);
    } else {
      saveData(KEYS.ALBUMS, albums.map((a) => a.id === editing ? { ...a, ...albumData } : a));
    }
    setEditing(null);
    loadAlbums();
  };

  const remove = (id) => {
    if (!confirm('Delete this album?')) return;
    saveData(KEYS.ALBUMS, albums.filter((a) => a.id !== id));
    setAlbums(albums.filter((a) => a.id !== id));
  };

  return (
    <div>
      <div className="flex-between mb-3">
        <h1 className="page-title">Manage Albums</h1>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Album</button>
      </div>

      <div className="topbar-search mb-3" style={{ maxWidth: '400px' }}>
        <Search size={18} />
        <input type="text" placeholder="Search albums..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Cover</th><th>Title</th><th>Artist</th><th>Genre</th><th>Year</th><th>Songs</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td><img src={a.cover} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px' }} /></td>
                <td>{a.title}</td><td>{a.artist}</td>
                <td><span className="badge badge-info">{a.genre}</span></td>
                <td>{a.year}</td><td>{a.songIds?.length || 0}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="player-btn" onClick={() => openEdit(a)}><Edit2 size={16} /></button>
                    <button className="player-btn" onClick={() => remove(a.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Add Album' : 'Edit Album'} onClose={() => setEditing(null)}>
          <div className="form-group">
            <label className="form-label">Album Name</label>
            <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Artist</label>
            <select className="form-select" value={form.artistId} onChange={(e) => setForm({ ...form, artistId: e.target.value })}>
              <option value="">Select artist</option>
              {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Genre</label>
            <select className="form-select" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
              {genres.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Release Year</label>
            <input className="form-input" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <input className="form-input" value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} placeholder="https://..." />
          </div>
          <button className="btn btn-primary btn-full" onClick={save}>Save</button>
        </Modal>
      )}
    </div>
  );
}
