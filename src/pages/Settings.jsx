import { useState, useEffect } from 'react';
import { getData, saveData, KEYS } from '../utils/localStorage.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Moon, Sun, Play, Volume2, Bell, Globe, Shield } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({});

  useEffect(() => {
    setSettings(getData(KEYS.SETTINGS) || {});
  }, []);

  const update = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveData(KEYS.SETTINGS, updated);

    if (key === 'darkMode') {
      document.documentElement.setAttribute('data-theme', value ? 'dark' : 'light');
    }
  };

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 className="page-title">Settings</h1>

      <div className="chart-container mb-3">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />} Appearance
        </h3>
        <div className="flex-between">
          <span>Dark Mode</span>
          <label className="toggle">
            <input type="checkbox" checked={settings.darkMode} onChange={(e) => update('darkMode', e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="chart-container mb-3">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Play size={20} /> Playback
        </h3>
        <div className="flex-between mb-2">
          <span>Autoplay</span>
          <label className="toggle">
            <input type="checkbox" checked={settings.autoplay} onChange={(e) => update('autoplay', e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="flex-between">
          <span><Volume2 size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />Audio Quality</span>
          <select className="form-select" style={{ width: 'auto' }} value={settings.audioQuality} onChange={(e) => update('audioQuality', e.target.value)}>
            <option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
          </select>
        </div>
      </div>

      <div className="chart-container mb-3">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={20} /> Notifications
        </h3>
        <div className="flex-between">
          <span>Enable Notifications</span>
          <label className="toggle">
            <input type="checkbox" checked={settings.notifications} onChange={(e) => update('notifications', e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="chart-container mb-3">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={20} /> Language
        </h3>
        <select className="form-select" value={settings.language} onChange={(e) => update('language', e.target.value)}>
          <option>English</option><option>Spanish</option><option>French</option>
          <option>German</option><option>Hindi</option><option>Japanese</option>
        </select>
      </div>

      <div className="chart-container mb-3">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={20} /> Account
        </h3>
        <div className="mb-2"><span className="text-secondary text-sm">Email</span><br /><strong>{user?.email}</strong></div>
        <div className="mb-2"><span className="text-secondary text-sm">Role</span><br /><strong>{user?.role}</strong></div>
      </div>

      <style>{`
        .toggle { position: relative; display: inline-block; width: 44px; height: 24px; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute; cursor: pointer; inset: 0;
          background: var(--border-strong); border-radius: 24px; transition: var(--transition);
        }
        .toggle-slider:before {
          content: ""; position: absolute; height: 18px; width: 18px;
          left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: var(--transition);
        }
        .toggle input:checked + .toggle-slider { background: var(--primary); }
        .toggle input:checked + .toggle-slider:before { transform: translateX(20px); }
      `}</style>
    </div>
  );
}
