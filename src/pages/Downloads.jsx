import { useState, useEffect } from 'react';
import { getData, KEYS, saveData } from '../utils/localStorage.js';
import { useAuth } from '../context/AuthContext.jsx';
import { usePlayer } from '../context/MusicPlayerContext.jsx';
import { SongRow } from '../components/SongRow.jsx';
import { Download, Trash2, Clock } from 'lucide-react';

export default function Downloads() {
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    const allDownloads = getData(KEYS.DOWNLOADS) || {};
    const userDownloads = allDownloads[user?.id] || [];
    const songs = getData(KEYS.SONGS) || [];
    setDownloads(userDownloads.map((d) => {
      const song = songs.find((s) => s.id === d.songId);
      return song ? { ...song, downloadedAt: d.downloadedAt } : null;
    }).filter(Boolean));
  }, [user]);

  const removeDownload = (songId) => {
    const allDownloads = getData(KEYS.DOWNLOADS) || {};
    const userDownloads = allDownloads[user.id] || [];
    saveData(KEYS.DOWNLOADS, {
      ...allDownloads,
      [user.id]: userDownloads.filter((d) => d.songId !== songId),
    });
    setDownloads(downloads.filter((d) => d.id !== songId));
  };

  return (
    <div>
      <h1 className="page-title">Downloads</h1>
      <p className="text-secondary mb-3">
        These songs are available offline (demo simulation). No actual files are downloaded.
      </p>

      {downloads.length === 0 ? (
        <div className="empty-state">
          <Download size={48} />
          <h3>No downloads yet</h3>
          <p>Songs you download will appear here for offline listening</p>
        </div>
      ) : (
        <div className="song-list">
          <div className="song-list-header">
            <span>#</span><span></span><span>Title</span><span>Album</span><span>Downloaded</span><span>Duration</span><span></span>
          </div>
          {downloads.map((song, i) => (
            <div key={song.id} className={`song-row ${false ? 'playing' : ''}`}>
              <span className="song-index">{i + 1}</span>
              <img src={song.cover} alt={song.title} onClick={() => playSong(song, downloads)} style={{ cursor: 'pointer' }} />
              <div className="song-title-cell" onClick={() => playSong(song, downloads)} style={{ cursor: 'pointer' }}>
                <span className="t">{song.title}</span>
                <span className="a">{song.artist}</span>
              </div>
              <span className="song-cell">{song.album}</span>
              <span className="song-cell">{new Date(song.downloadedAt).toLocaleDateString()}</span>
              <span className="song-cell">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
              <div className="song-actions" style={{ opacity: 1 }}>
                <button onClick={() => removeDownload(song.id)} title="Remove download">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
