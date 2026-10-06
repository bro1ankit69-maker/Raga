import { useState, useEffect } from 'react';
import { getData, saveData, KEYS, genId } from '../utils/localStorage.js';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/Modal.jsx';

const EMPTY = { name: '', color: '#1db954' };

export default function ManageGenres() {
  const [genres, setGenres] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { setGenres(getData(KEYS.GENRES) || []); }, []);

  const openAdd = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (g) => { setForm({ ...g }); setEditing(g.id); };

  const save = () => {
    if (!form.name.trim()) return;
    if (editing === 'new') {
      saveData(KEYS.GENRES, [...genres, { ...form, id: genId() }]);
    } else {
      saveData(KEYS.GENRES, genres.map((g) => g.id === editing ? { ...g, ...form } : g));
    }
    setGenres(getData(KEYS.GENRES));
    setEditing(null);
  };

  const remove = (id) => {
    if (!confirm('Delete this genre?')) return;
    saveData(KEYS.GENRES, genres.filter((g) => g.id !== id));
    setGenres(genres.filter((g) => g.id !== id));
  };

  return (
    <div>
      <div className="flex-between mb-3">
        <h1 className="page-title">Manage Genres</h1>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Genre</button>
      </div>

      <div className="card-grid cols-5">
        {genres.map((g) => (
          <div key={g.id} className="genre-card" style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color}99)`, position: 'relative' }}>
            {g.name}
            <div style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', display: 'flex', gap: '0.25rem' }}>
              <button className="player-btn" style={{ background: 'rgba(0,0,0,0.3)', color: 'white' }} onClick={() => openEdit(g)}><Edit2 size={14} /></button>
              <button className="player-btn" style={{ background: 'rgba(0,0,0,0.3)', color: 'white' }} onClick={() => remove(g.id)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Add Genre' : 'Edit Genre'} onClose={() => setEditing(null)}>
          <div className="form-group">
            <label className="form-label">Genre Name</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Color</label>
            <input className="form-input" type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} style={{ height: '50px' }} />
          </div>
          <button className="btn btn-primary btn-full" onClick={save}>Save</button>
        </Modal>
      )}
    </div>
  );
}
