import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getData, KEYS } from '../utils/localStorage.js';
import {
  LayoutDashboard, Users, Music, Disc, Mic, Tag, ListMusic, Star,
  BarChart3, Settings, LogOut,
} from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { to: '/admin/songs', icon: <Music size={20} />, label: 'Songs' },
    { to: '/admin/albums', icon: <Disc size={20} />, label: 'Albums' },
    { to: '/admin/artists', icon: <Mic size={20} />, label: 'Artists' },
    { to: '/admin/genres', icon: <Tag size={20} />, label: 'Genres' },
    { to: '/admin/playlists', icon: <ListMusic size={20} />, label: 'Playlists' },
    { to: '/admin/featured', icon: <Star size={20} />, label: 'Featured' },
    { to: '/admin/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
    { to: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const link = (l) => (
    <div
      key={l.to}
      className={`sidebar-link ${location.pathname === l.to ? 'active' : ''}`}
      onClick={() => { navigate(l.to); setOpen(false); }}
    >
      {l.icon}
      <span>{l.label}</span>
    </div>
  );

  return (
    <div className="admin-layout">
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`admin-sidebar sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo" onClick={() => { navigate('/admin'); setOpen(false); }}>
          <span className="logo-icon"><Music size={20} /></span>
          RagaPlay
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-label">Admin Panel</div>
            {links.map(link)}
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-link" onClick={() => { logout(); navigate('/'); }}>
            <LogOut />
            <span>Logout</span>
          </div>
        </div>
      </aside>
      <div className="admin-main">
        <div className="admin-header">
          <button className="mobile-menu-btn" onClick={() => setOpen(true)}>
            <span style={{ fontSize: '1.5rem' }}>&#9776;</span>
          </button>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Admin Dashboard</h2>
          <div className="topbar-avatar" style={{ marginLeft: 'auto' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
