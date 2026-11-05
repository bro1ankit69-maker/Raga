import { useState, useEffect } from 'react';
import { getData, saveData, KEYS, genId } from '../utils/localStorage.js';
import { Search, Trash2, Eye, UserCheck, UserX } from 'lucide-react';
import Modal from '../components/Modal.jsx';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [viewUser, setViewUser] = useState(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = () => {
    setUsers(getData(KEYS.USERS) || []);
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  const toggleStatus = (id) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'deactivated' : 'active' } : u
    );
    saveData(KEYS.USERS, updated);
    setUsers(updated);
  };

  const deleteUser = (id) => {
    if (!confirm('Delete this user?')) return;
    const updated = users.filter((u) => u.id !== id);
    saveData(KEYS.USERS, updated);
    setUsers(updated);
  };

  return (
    <div>
      <h1 className="page-title">Manage Users</h1>

      <div className="topbar-search mb-3" style={{ maxWidth: '400px' }}>
        <Search size={18} />
        <input type="text" placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Country</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`badge ${u.role === 'admin' ? 'badge-info' : 'badge-success'}`}>{u.role}</span></td>
                <td>{u.country || 'N/A'}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td><span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{u.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="player-btn" onClick={() => setViewUser(u)}><Eye size={16} /></button>
                    <button className="player-btn" onClick={() => toggleStatus(u.id)} title="Toggle status">
                      {u.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                    <button className="player-btn" onClick={() => deleteUser(u.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewUser && (
        <Modal title="User Details" onClose={() => setViewUser(null)}>
          <div className="mb-2"><span className="text-secondary text-sm">Name</span><br /><strong>{viewUser.name}</strong></div>
          <div className="mb-2"><span className="text-secondary text-sm">Email</span><br /><strong>{viewUser.email}</strong></div>
          <div className="mb-2"><span className="text-secondary text-sm">Role</span><br /><strong>{viewUser.role}</strong></div>
          <div className="mb-2"><span className="text-secondary text-sm">Country</span><br /><strong>{viewUser.country}</strong></div>
          <div className="mb-2"><span className="text-secondary text-sm">Date of Birth</span><br /><strong>{viewUser.dob}</strong></div>
          <div className="mb-2"><span className="text-secondary text-sm">Status</span><br /><strong>{viewUser.status}</strong></div>
          <div className="mb-2"><span className="text-secondary text-sm">Joined</span><br /><strong>{new Date(viewUser.createdAt).toLocaleString()}</strong></div>
        </Modal>
      )}
    </div>
  );
}
