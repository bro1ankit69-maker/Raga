import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getData, KEYS } from '../utils/localStorage.js';
import {
  Home, Search, Compass, Library, ListMusic, Heart, Download, UserPlus,
  Settings, User, LogOut, Music,
} from 'lucide-react';

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const playlists = (getData(KEYS.PLAYLISTS) || []).filter(
    (p) => p.ownerId === user?.id || p.privacy === 'Public'
  );

  const link = (to, icon, label) => (
    <div
      className={`sidebar-link ${location.pathname === to ? 'active' : ''}`}
      onClick={() => { navigate(to); onClose?.(); }}
    >
      {icon}
      <span>{label}</span>
    </div>
  );

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo" onClick={() => { navigate('/home'); onClose?.(); }}>
          <span className="logo-icon"><Music size={20} /></span>
          RagaPlay
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            {link('/home', <Home />, 'Home')}
            {link('/search', <Search />, 'Search')}
            {link('/discover', <Compass />, 'Discover')}
            {link('/library', <Library />, 'Library')}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Your Music</div>
            {link('/playlists', <ListMusic />, 'Playlists')}
            {link('/liked', <Heart />, 'Liked Songs')}
            {link('/downloads', <Download />, 'Downloads')}
            {link('/followed', <UserPlus />, 'Followed Artists')}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Your Playlists</div>
            {playlists.slice(0, 8).map((pl) => (
              <div
                key={pl.id}
                className={`sidebar-link ${location.pathname === `/playlist/${pl.id}` ? 'active' : ''}`}
                onClick={() => { navigate(`/playlist/${pl.id}`); onClose?.(); }}
              >
                <ListMusic size={20} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.name}</span>
              </div>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          {link('/settings', <Settings />, 'Settings')}
          {link('/profile', <User />, 'Profile')}
          <div className="sidebar-link" onClick={() => { logout(); navigate('/'); }}>
            <LogOut />
            <span>Logout</span>
          </div>
        </div>
      </aside>
    </>
  );
}
