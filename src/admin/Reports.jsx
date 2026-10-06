import { useState, useEffect } from 'react';
import { getData, KEYS } from '../utils/localStorage.js';

export default function Reports() {
  const [data, setData] = useState({});

  useEffect(() => {
    const songs = getData(KEYS.SONGS) || [];
    const artists = getData(KEYS.ARTISTS) || [];
    const users = getData(KEYS.USERS) || [];
    const downloads = getData(KEYS.DOWNLOADS) || {};

    const totalPlays = songs.reduce((sum, s) => sum + (s.plays || 0), 0);
    const totalDownloads = Object.values(downloads).reduce((sum, arr) => sum + arr.length, 0);

    const mostPlayed = [...songs].sort((a, b) => b.plays - a.plays).slice(0, 10);
    const mostFollowed = [...artists].sort((a, b) => b.followers - a.followers).slice(0, 10);

    const genreCount = {};
    songs.forEach((s) => { genreCount[s.genre] = (genreCount[s.genre] || 0) + (s.plays || 0); });
    const popularGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);

    // Download counts per song
    const downloadCount = {};
    Object.values(downloads).forEach((arr) => {
      arr.forEach((d) => { downloadCount[d.songId] = (downloadCount[d.songId] || 0) + 1; });
    });
    const mostDownloaded = songs
      .map((s) => ({ ...s, downloadCount: downloadCount[s.id] || 0 }))
      .sort((a, b) => b.downloadCount - a.downloadCount)
      .slice(0, 10);

    // Simulated daily/weekly/monthly plays (divide total across 30 days)
    const dailyPlays = Math.round(totalPlays / 30);
    const weeklyPlays = Math.round(totalPlays / 4);
    const monthlyPlays = totalPlays;

    // Generate last 7 days simulated data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return { day: date.toLocaleDateString('en', { weekday: 'short' }), plays: Math.round(totalPlays / 30 * (0.7 + Math.random() * 0.6)) };
    });

    const maxDay = Math.max(...last7Days.map((d) => d.plays));
    const maxPlays = mostPlayed[0]?.plays || 1;
    const maxFollowers = mostFollowed[0]?.followers || 1;
    const maxDownloads = mostDownloaded[0]?.downloadCount || 1;
    const maxGenrePlays = popularGenres[0]?.[1] || 1;

    setData({ mostPlayed, mostFollowed, popularGenres, mostDownloaded, dailyPlays, weeklyPlays, monthlyPlays, last7Days, maxDay, maxPlays, maxFollowers, maxDownloads, maxGenrePlays, totalUsers: users.length });
  }, []);

  return (
    <div>
      <h1 className="page-title">Reports & Analytics</h1>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{(data.dailyPlays || 0).toLocaleString()}</div><div className="stat-label">Daily Plays</div></div>
        <div className="stat-card"><div className="stat-value">{(data.weeklyPlays || 0).toLocaleString()}</div><div className="stat-label">Weekly Plays</div></div>
        <div className="stat-card"><div className="stat-value">{(data.monthlyPlays || 0).toLocaleString()}</div><div className="stat-label">Monthly Plays</div></div>
        <div className="stat-card"><div className="stat-value">{data.totalUsers || 0}</div><div className="stat-label">Total Users</div></div>
      </div>

      <div className="chart-container mb-3">
        <h3 className="section-title" style={{ fontSize: '1.1rem' }}>Plays - Last 7 Days</h3>
        <div className="simple-bar-chart" style={{ height: '180px', paddingBottom: '1.5rem' }}>
          {data.last7Days?.map((d) => (
            <div className="simple-bar" key={d.day} style={{ height: `${(d.plays / data.maxDay) * 100}%` }}>
              <span className="bar-label">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="chart-container">
          <h3 className="section-title" style={{ fontSize: '1.1rem' }}>Most Played Songs</h3>
          {data.mostPlayed?.slice(0, 7).map((s) => (
            <div className="horizontal-bar" key={s.id}>
              <span className="bar-name">{s.title}</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${(s.plays / data.maxPlays) * 100}%` }} /></div>
              <span className="bar-value">{(s.plays / 1000).toFixed(0)}K</span>
            </div>
          ))}
        </div>

        <div className="chart-container">
          <h3 className="section-title" style={{ fontSize: '1.1rem' }}>Most Followed Artists</h3>
          {data.mostFollowed?.slice(0, 7).map((a) => (
            <div className="horizontal-bar" key={a.id}>
              <span className="bar-name">{a.name}</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${(a.followers / data.maxFollowers) * 100}%` }} /></div>
              <span className="bar-value">{(a.followers / 1000).toFixed(0)}K</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="chart-container">
          <h3 className="section-title" style={{ fontSize: '1.1rem' }}>Most Downloaded Songs</h3>
          {data.mostDownloaded?.slice(0, 7).map((s) => (
            <div className="horizontal-bar" key={s.id}>
              <span className="bar-name">{s.title}</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${(s.downloadCount / data.maxDownloads) * 100}%` }} /></div>
              <span className="bar-value">{s.downloadCount}</span>
            </div>
          ))}
        </div>

        <div className="chart-container">
          <h3 className="section-title" style={{ fontSize: '1.1rem' }}>Popular Genres</h3>
          {data.popularGenres?.slice(0, 7).map(([genre, plays]) => (
            <div className="horizontal-bar" key={genre}>
              <span className="bar-name">{genre}</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${(plays / data.maxGenrePlays) * 100}%` }} /></div>
              <span className="bar-value">{(plays / 1000).toFixed(0)}K</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
