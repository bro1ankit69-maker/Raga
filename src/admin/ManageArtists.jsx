import { useState, useEffect } from 'react';
import { getData, saveData, KEYS, genId } from '../utils/localStorage.js';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/Modal.jsx';

const EMPTY = { name: '', bio: '', genre: 'Pop', image: '', followers: 0 };

export default function ManageArtists() {
  const [artists, setArtists] = useState([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { loadArtists(); }, []);
  const loadArtists = () => setArtists(getData(KEYS.ARTISTS) || []);
  const genres = ['Pop', 'Rock', 'Hip Hop', 'EDM', 'Jazz', 'Classical', 'Lo-Fi', 'Bollywood', 'Indie', 'R&B'];

  const filtered = artists.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));

  const openAdd = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (artist) => { setForm({ ...artist }); setEditing(artist.id); };

  const save = () => {
    if (!form.name.trim()) return;
    const data = {
      ...form,
      followers: Number(form.followers) || 0,
      image: form.image || `https://i.pravatar.cc/300?u=${form.name}`,
    };
    if (editing === 'new') {
      saveData(KEYS.ARTISTS, [...artists, { ...data, id: genId() }]);
    } else {
      saveData(KEYS.ARTISTS, artists.map((a) => a.id === editing ? { ...a, ...data } : a));
    }
    setEditing(null);
    loadArtists();
  };

  const remove = (id) => {
    if (!confirm('Delete this artist?')) return;
    saveData(KEYS.ARTISTS, artists.filter((a) => a.id !== id));
    setArtists(artists.filter((a) => a.id !== id));
  };

  return (
    <div>
      <div className="flex-between mb-3">
        <h1 className="page-title">Manage Artists</h1>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Artist</button>
      </div>

      <div className="topbar-search mb-3" style={{ maxWidth: '400px' }}>
        <Search size={18} />
        <input type="text" placeholder="Search artists..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Image</th><th>Name</th><th>Genre</th><th>Followers</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td><img src={a.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} /></td>
                <td>{a.name}</td>
                <td><span className="badge badge-info">{a.genre}</span></td>
                <td>{(a.followers || 0).toLocaleString()}</td>
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
        <Modal title={editing === 'new' ? 'Add Artist' : 'Edit Artist'} onClose={() => setEditing(null)}>
          <div className="form-group">
            <label className="form-label">Artist Name</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Biography</label>
            <textarea className="form-textarea" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Genre</label>
            <select className="form-select" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
              {genres.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input className="form-input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Followers</label>
            <input className="form-input" type="number" value={form.followers} onChange={(e) => setForm({ ...form, followers: e.target.value })} />
          </div>
          <button className="btn btn-primary btn-full" onClick={save}>Save</button>
        </Modal>
      )}
    </div>
  );
}
