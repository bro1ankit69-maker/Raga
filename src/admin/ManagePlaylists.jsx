import { useState, useEffect } from 'react';
import { getData, saveData, KEYS, genId } from '../utils/localStorage.js';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/Modal.jsx';

const EMPTY = { name: '', description: '', cover: '', privacy: 'Public' };

export default function ManagePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { loadPlaylists(); }, []);
  const loadPlaylists = () => setPlaylists(getData(KEYS.PLAYLISTS) || []);

  const filtered = playlists.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  const openAdd = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (pl) => { setForm({ ...pl }); setEditing(pl.id); };

  const save = () => {
    if (!form.name.trim()) return;
    const data = {
      ...form,
      cover: form.cover || `https://picsum.photos/seed/${form.name}/400/400`,
      songIds: form.songIds || [],
      ownerId: form.ownerId || 'admin',
    };
    if (editing === 'new') {
      saveData(KEYS.PLAYLISTS, [...playlists, { ...data, id: genId() }]);
    } else {
      saveData(KEYS.PLAYLISTS, playlists.map((p) => p.id === editing ? { ...p, ...data } : p));
    }
    setEditing(null);
    loadPlaylists();
  };

  const remove = (id) => {
    if (!confirm('Delete this playlist?')) return;
    saveData(KEYS.PLAYLISTS, playlists.filter((p) => p.id !== id));
    setPlaylists(playlists.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex-between mb-3">
        <h1 className="page-title">Manage Playlists</h1>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Playlist</button>
      </div>

      <div className="topbar-search mb-3" style={{ maxWidth: '400px' }}>
        <Search size={18} />
        <input type="text" placeholder="Search playlists..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Cover</th><th>Name</th><th>Description</th><th>Songs</th><th>Privacy</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td><img src={p.cover} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px' }} /></td>
                <td>{p.name}</td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</td>
                <td>{p.songIds?.length || 0}</td>
                <td><span className={`badge ${p.privacy === 'Public' ? 'badge-success' : 'badge-warning'}`}>{p.privacy}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="player-btn" onClick={() => openEdit(p)}><Edit2 size={16} /></button>
                    <button className="player-btn" onClick={() => remove(p.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Add Playlist' : 'Edit Playlist'} onClose={() => setEditing(null)}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <input className="form-input" value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Privacy</label>
            <select className="form-select" value={form.privacy} onChange={(e) => setForm({ ...form, privacy: e.target.value })}>
              <option>Public</option><option>Private</option>
            </select>
          </div>
          <button className="btn btn-primary btn-full" onClick={save}>Save</button>
        </Modal>
      )}
    </div>
  );
}
