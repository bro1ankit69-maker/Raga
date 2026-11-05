import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getData, KEYS } from '../utils/localStorage.js';
import { useNavigate } from 'react-router-dom';
import { Edit2, Save, X, Music, Heart, ListMusic, Clock } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', country: '', dob: '' });
  const [stats, setStats] = useState({});

  useEffect(() => {
    const users = getData(KEYS.USERS) || [];
    const fullUser = users.find((u) => u.id === user?.id);
    if (fullUser) setForm({ name: fullUser.name, country: fullUser.country, dob: fullUser.dob });

    const likedSongs = getData(KEYS.LIKED_SONGS) || {};
    const playlists = (getData(KEYS.PLAYLISTS) || []).filter((p) => p.ownerId === user?.id);
    const recent = getData(KEYS.RECENTLY_PLAYED) || {};
    const followed = getData(KEYS.FOLLOWED_ARTISTS) || {};
    const songs = getData(KEYS.SONGS) || [];
    const userLiked = (likedSongs[user?.id] || []).map((id) => songs.find((s) => s.id === id)).filter(Boolean);
    const userRecent = (recent[user?.id] || []).map((r) => songs.find((s) => s.id === r.songId)).filter(Boolean);

    // Favorite genres from liked songs
    const genreCount = {};
    userLiked.forEach((s) => { genreCount[s.genre] = (genreCount[s.genre] || 0) + 1; });
    const favGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).map(([g]) => g).slice(0, 5);
    if (favGenres.length === 0) favGenres.push('Not enough data');

    const followedArtists = (followed[user?.id] || []).map((id) => {
      const artists = getData(KEYS.ARTISTS) || [];
      return artists.find((a) => a.id === id);
    }).filter(Boolean);

    setStats({ likedCount: userLiked.length, playlistCount: playlists.length, recentCount: userRecent.length,
      favGenres, followedArtists, userRecent, playlists });
  }, [user]);

  const save = () => {
    updateUser({ name: form.name, country: form.country, dob: form.dob });
    setEditing(false);
  };

  const initials = user?.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div>
      <h1 className="page-title">Profile</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', maxWidth: '900px' }}>
        <div className="chart-container" style={{ textAlign: 'center' }}>
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'var(--gradient-2)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', fontWeight: 800, margin: '0 auto 1rem',
          }}>
            {initials}
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{user?.name}</h3>
          <p className="text-secondary text-sm">{user?.email}</p>
          <span className="badge badge-info mt-2" style={{ display: 'inline-block' }}>
            {user?.role?.toUpperCase()}
          </span>
        </div>

        <div className="chart-container">
          <div className="flex-between mb-2">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Account Information</h3>
            {editing ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary" onClick={save}><Save size={16} /> Save</button>
                <button className="btn btn-ghost" onClick={() => setEditing(false)}><X size={16} /> Cancel</button>
              </div>
            ) : (
              <button className="btn btn-ghost" onClick={() => setEditing(true)}><Edit2 size={16} /> Edit</button>
            )}
          </div>

          {editing ? (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input className="form-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input className="form-input" type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
              </div>
            </>
          ) : (
            <>
              <div className="mb-2"><span className="text-secondary text-sm">Name</span><br /><strong>{user?.name}</strong></div>
              <div className="mb-2"><span className="text-secondary text-sm">Email</span><br /><strong>{user?.email}</strong></div>
              <div className="mb-2"><span className="text-secondary text-sm">Country</span><br /><strong>{form.country || 'N/A'}</strong></div>
              <div className="mb-2"><span className="text-secondary text-sm">Date of Birth</span><br /><strong>{form.dob || 'N/A'}</strong></div>
            </>
          )}
        </div>
      </div>

      <div className="stat-grid mt-3" style={{ maxWidth: '900px' }}>
        <div className="stat-card">
          <div className="stat-icon"><Heart size={22} /></div>
          <div className="stat-value">{stats.likedCount || 0}</div>
          <div className="stat-label">Liked Songs</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><ListMusic size={22} /></div>
          <div className="stat-value">{stats.playlistCount || 0}</div>
          <div className="stat-label">Playlists</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Music size={22} /></div>
          <div className="stat-value">{stats.followedArtists?.length || 0}</div>
          <div className="stat-label">Followed Artists</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Clock size={22} /></div>
          <div className="stat-value">{stats.recentCount || 0}</div>
          <div className="stat-label">Recently Played</div>
        </div>
      </div>

      <div className="chart-container mt-3" style={{ maxWidth: '900px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Favorite Genres</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(stats.favGenres || []).map((g) => (
            <span key={g} className="badge badge-success">{g}</span>
          ))}
        </div>
      </div>

      {stats.followedArtists && stats.followedArtists.length > 0 && (
        <div className="chart-container mt-3" style={{ maxWidth: '900px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Followed Artists</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {stats.followedArtists.map((a) => (
              <div key={a.id} className="cursor-pointer" onClick={() => navigate(`/artist/${a.id}`)}>
                <img src={a.image} alt={a.name} style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                <div className="text-sm text-secondary" style={{ textAlign: 'center', marginTop: '0.3rem' }}>{a.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
