import { useState, useEffect } from 'react';
import { getData, saveData, KEYS, genId } from '../utils/localStorage.js';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/Modal.jsx';

const EMPTY = { title: '', artist: '', artistId: '', album: '', albumId: '', genre: 'Pop', duration: 200, year: 2024, cover: '', audioUrl: '' };

export default function ManageSongs() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [query, setQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    loadSongs();
    setArtists(getData(KEYS.ARTISTS) || []);
    setAlbums(getData(KEYS.ALBUMS) || []);
  }, []);

  const loadSongs = () => setSongs(getData(KEYS.SONGS) || []);

  const genres = ['Pop', 'Rock', 'Hip Hop', 'EDM', 'Jazz', 'Classical', 'Lo-Fi', 'Bollywood', 'Indie', 'R&B'];

  const filtered = songs.filter((s) => {
    const matchQuery = s.title.toLowerCase().includes(query.toLowerCase()) || s.artist.toLowerCase().includes(query.toLowerCase());
    const matchGenre = genreFilter === 'All' || s.genre === genreFilter;
    return matchQuery && matchGenre;
  });

  const openAdd = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (song) => { setForm({ ...song }); setEditing(song.id); };

  const save = () => {
    if (!form.title.trim()) return;
    const artist = artists.find((a) => a.id === form.artistId);
    const album = albums.find((al) => al.id === form.albumId);
    const songData = {
      ...form,
      artist: artist?.name || form.artist,
      album: album?.title || form.album,
      duration: Number(form.duration),
      year: Number(form.year),
      cover: form.cover || album?.cover || `https://picsum.photos/seed/${form.title}/400/400`,
      audioUrl: form.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      plays: form.plays || 0,
    };
    if (editing === 'new') {
      const newSong = { ...songData, id: genId() };
      const updated = [...songs, newSong];
      saveData(KEYS.SONGS, updated);
      if (album) {
        const updatedAlbums = albums.map((a) => a.id === album.id ? { ...a, songIds: [...a.songIds, newSong.id] } : a);
        saveData(KEYS.ALBUMS, updatedAlbums);
        setAlbums(updatedAlbums);
      }
    } else {
      const updated = songs.map((s) => s.id === editing ? { ...s, ...songData } : s);
      saveData(KEYS.SONGS, updated);
    }
    setEditing(null);
    loadSongs();
  };

  const remove = (id) => {
    if (!confirm('Delete this song?')) return;
    saveData(KEYS.SONGS, songs.filter((s) => s.id !== id));
    setSongs(songs.filter((s) => s.id !== id));
  };

  return (
    <div>
      <div className="flex-between mb-3">
        <h1 className="page-title">Manage Songs</h1>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Song</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="topbar-search" style={{ maxWidth: '300px' }}>
          <Search size={18} />
          <input type="text" placeholder="Search songs..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
          <option>All</option>
          {genres.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Cover</th><th>Title</th><th>Artist</th><th>Album</th><th>Genre</th><th>Year</th><th>Plays</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td><img src={s.cover} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px' }} /></td>
                <td>{s.title}</td><td>{s.artist}</td><td>{s.album}</td>
                <td><span className="badge badge-info">{s.genre}</span></td>
                <td>{s.year}</td><td>{(s.plays || 0).toLocaleString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="player-btn" onClick={() => openEdit(s)}><Edit2 size={16} /></button>
                    <button className="player-btn" onClick={() => remove(s.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Add Song' : 'Edit Song'} onClose={() => setEditing(null)}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Artist</label>
            <select className="form-select" value={form.artistId} onChange={(e) => setForm({ ...form, artistId: e.target.value })}>
              <option value="">Select artist</option>
              {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Album</label>
            <select className="form-select" value={form.albumId} onChange={(e) => setForm({ ...form, albumId: e.target.value })}>
              <option value="">Select album</option>
              {albums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Genre</label>
            <select className="form-select" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
              {genres.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Duration (seconds)</label>
              <input className="form-input" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Release Year</label>
              <input className="form-input" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <input className="form-input" value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Audio URL</label>
            <input className="form-input" value={form.audioUrl} onChange={(e) => setForm({ ...form, audioUrl: e.target.value })} placeholder="https://..." />
          </div>
          <button className="btn btn-primary btn-full" onClick={save}>Save</button>
        </Modal>
      )}
    </div>
  );
}
