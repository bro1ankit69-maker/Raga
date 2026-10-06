import { useState, useEffect } from 'react';
import { getData, saveData, KEYS } from '../utils/localStorage.js';

export default function AdminSettings() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    setSettings(getData(KEYS.SETTINGS) || {});
  }, []);

  const update = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveData(KEYS.SETTINGS, updated);
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 className="page-title">Admin Settings</h1>

      <div className="chart-container mb-3">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Platform Settings</h3>
        <div className="form-group">
          <label className="form-label">Audio Quality Default</label>
          <select className="form-select" value={settings.audioQuality || 'High'} onChange={(e) => update('audioQuality', e.target.value)}>
            <option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Default Language</label>
          <select className="form-select" value={settings.language || 'English'} onChange={(e) => update('language', e.target.value)}>
            <option>English</option><option>Spanish</option><option>French</option><option>Hindi</option>
          </select>
        </div>
        <div className="flex-between">
          <span>Notifications</span>
          <label className="toggle">
            <input type="checkbox" checked={settings.notifications !== false} onChange={(e) => update('notifications', e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="chart-container">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>System Info</h3>
        <div className="mb-2"><span className="text-secondary text-sm">Platform</span><br /><strong>RagaPlay Music Streaming</strong></div>
        <div className="mb-2"><span className="text-secondary text-sm">Version</span><br /><strong>1.0.0</strong></div>
        <div className="mb-2"><span className="text-secondary text-sm">Storage</span><br /><strong>LocalStorage (Browser)</strong></div>
      </div>

      <style>{`
        .toggle { position: relative; display: inline-block; width: 44px; height: 24px; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-slider { position: absolute; cursor: pointer; inset: 0; background: var(--border-strong); border-radius: 24px; transition: var(--transition); }
        .toggle-slider:before { content: ""; position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: var(--transition); }
        .toggle input:checked + .toggle-slider { background: var(--primary); }
        .toggle input:checked + .toggle-slider:before { transform: translateX(20px); }
      `}</style>
    </div>
  );
}
