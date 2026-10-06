import { useState, useEffect } from 'react';
import { getData, KEYS } from '../utils/localStorage.js';
import { Users, Music, Disc, Mic, ListMusic, Play, Download, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const users = getData(KEYS.USERS) || [];
    const songs = getData(KEYS.SONGS) || [];
    const albums = getData(KEYS.ALBUMS) || [];
    const artists = getData(KEYS.ARTISTS) || [];
    const playlists = getData(KEYS.PLAYLISTS) || [];
    const totalPlays = songs.reduce((sum, s) => sum + (s.plays || 0), 0);

    const downloads = getData(KEYS.DOWNLOADS) || {};
    const totalDownloads = Object.values(downloads).reduce((sum, arr) => sum + arr.length, 0);

    const mostPlayed = [...songs].sort((a, b) => b.plays - a.plays).slice(0, 5);
    const mostPopularArtists = [...artists].sort((a, b) => b.followers - a.followers).slice(0, 5);

    const genreCount = {};
    songs.forEach((s) => { genreCount[s.genre] = (genreCount[s.genre] || 0) + (s.plays || 0); });
    const popularGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const newUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    const maxGenrePlays = popularGenres[0]?.[1] || 1;
    const maxPlays = mostPlayed[0]?.plays || 1;
    const maxFollowers = mostPopularArtists[0]?.followers || 1;

    setStats({
      totalUsers: users.length, totalSongs: songs.length, totalAlbums: albums.length,
      totalArtists: artists.length, totalPlaylists: playlists.length,
      totalPlays, totalDownloads, mostPlayed, mostPopularArtists,
      popularGenres, newUsers, maxGenrePlays, maxPlays, maxFollowers,
    });
  }, []);

  const statCards = [
    { icon: <Users size={22} />, label: 'Total Users', value: stats.totalUsers },
    { icon: <Music size={22} />, label: 'Total Songs', value: stats.totalSongs },
    { icon: <Disc size={22} />, label: 'Total Albums', value: stats.totalAlbums },
    { icon: <Mic size={22} />, label: 'Total Artists', value: stats.totalArtists },
    { icon: <ListMusic size={22} />, label: 'Total Playlists', value: stats.totalPlaylists },
    { icon: <Play size={22} />, label: 'Total Plays', value: (stats.totalPlays || 0).toLocaleString() },
    { icon: <Download size={22} />, label: 'Total Downloads', value: stats.totalDownloads },
    { icon: <TrendingUp size={22} />, label: 'Avg Plays/Song', value: stats.totalSongs ? Math.round(stats.totalPlays / stats.totalSongs).toLocaleString() : 0 },
  ];

  return (
    <div>
      <h1 className="page-title">Dashboard Overview</h1>

      <div className="stat-grid">
        {statCards.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="chart-container">
          <h3 className="section-title" style={{ fontSize: '1.1rem' }}>Most Played Songs</h3>
          {stats.mostPlayed?.map((s, i) => (
            <div className="horizontal-bar" key={s.id}>
              <span className="bar-name">{s.title}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(s.plays / stats.maxPlays) * 100}%` }} />
              </div>
              <span className="bar-value">{(s.plays / 1000).toFixed(0)}K</span>
            </div>
          ))}
        </div>

        <div className="chart-container">
          <h3 className="section-title" style={{ fontSize: '1.1rem' }}>Most Popular Artists</h3>
          {stats.mostPopularArtists?.map((a, i) => (
            <div className="horizontal-bar" key={a.id}>
              <span className="bar-name">{a.name}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(a.followers / stats.maxFollowers) * 100}%` }} />
              </div>
              <span className="bar-value">{(a.followers / 1000).toFixed(0)}K</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-container mb-3">
        <h3 className="section-title" style={{ fontSize: '1.1rem' }}>Popular Genres</h3>
        <div className="simple-bar-chart" style={{ height: '160px' }}>
          {stats.popularGenres?.map(([genre, plays]) => (
            <div className="simple-bar" key={genre} style={{ height: `${(plays / stats.maxGenrePlays) * 100}%` }}>
              <span className="bar-label">{genre}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <h3 className="section-title" style={{ fontSize: '1.1rem' }}>New Users</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
            <tbody>
              {stats.newUsers?.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td><td>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-info' : 'badge-success'}`}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
