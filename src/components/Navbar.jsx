import { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="topbar">
      <button className="mobile-menu-btn" onClick={onMenuClick}>
        <Menu size={22} />
      </button>
      <div className="topbar-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search songs, artists, albums..."
          onFocus={() => navigate('/search')}
          readOnly
        />
      </div>
      <div className="topbar-right">
        <button className="topbar-icon-btn">
          <Bell size={20} />
          <span className="notification-dot" />
        </button>
        <div className="topbar-avatar" onClick={() => navigate('/profile')}>
          {initials}
        </div>
      </div>
    </div>
  );
}
