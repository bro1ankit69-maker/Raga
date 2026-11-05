import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData, KEYS, saveData } from '../utils/localStorage.js';
import { useAuth } from '../context/AuthContext.jsx';
import { usePlayer } from '../context/MusicPlayerContext.jsx';
import { SongCard, AlbumCard, PlaylistCard, ArtistCard } from '../components/Cards.jsx';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal.jsx';

export default function Library() {
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [newPl, setNewPl] = useState({ name: '', description: '', cover: '', privacy: 'Public' });

  useEffect(() => {
    const songs = getData(KEYS.SONGS) || [];
    const albums = getData(KEYS.ALBUMS) || [];
    const artists = getData(KEYS.ARTISTS) || [];
    const allPlaylists = getData(KEYS.PLAYLISTS) || [];
    const likedSongs = getData(KEYS.LIKED_SONGS) || {};
    const recent = getData(KEYS.RECENTLY_PLAYED) || {};
    const downloads = getData(KEYS.DOWNLOADS) || {};
    const followed = getData(KEYS.FOLLOWED_ARTISTS) || {};

    const userPlaylists = allPlaylists.filter((p) => p.ownerId === user?.id);
    const userLiked = (likedSongs[user?.id] || []).map((id) => songs.find((s) => s.id === id)).filter(Boolean);
    const userRecent = (recent[user?.id] || []).map((r) => songs.find((s) => s.id === r.songId)).filter(Boolean);
    const userDownloads = (downloads[user?.id] || []).map((d) => songs.find((s) => s.id === d.songId)).filter(Boolean);
    const userFollowed = (followed[user?.id] || []).map((id) => artists.find((a) => a.id === id)).filter(Boolean);

    setData({ userPlaylists, userLiked, userRecent, userDownloads, userFollowed, songs, albums });
  }, [user]);

  const createPlaylist = () => {
    if (!newPl.name.trim()) return;
    const playlists = getData(KEYS.PLAYLISTS) || [];
    const playlist = {
      ...newPl,
      id: 'pl' + Date.now(),
      ownerId: user.id,
      songIds: [],
      cover: newPl.cover || `https://picsum.photos/seed/${Date.now()}/400/400`,
    };
    saveData(KEYS.PLAYLISTS, [...playlists, playlist]);
    setShowCreate(false);
    setNewPl({ name: '', description: '', cover: '', privacy: 'Public' });
    navigate(`/playlist/${playlist.id}`);
  };

  const playSongFromList = (song) => {
    playSong(song, data.songs || []);
  };

  return (
    <div>
      <div className="flex-between mb-3">
        <h1 className="page-title">Your Library</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={18} /> Create Playlist
        </button>
      </div>

      {data.userPlaylists && data.userPlaylists.length > 0 && (
        <section className="page-section">
          <h2 className="section-title mb-2">Your Playlists</h2>
          <div className="card-grid cols-5">
            {data.userPlaylists.map((p) => <PlaylistCard key={p.id} playlist={p} />)}
          </div>
        </section>
      )}

      <section className="page-section">
        <h2 className="section-title mb-2">Liked Songs</h2>
        {data.userLiked && data.userLiked.length > 0 ? (
          <div className="card-grid cols-5">
            {data.userLiked.slice(0, 10).map((s) => <SongCard key={s.id} song={s} onPlay={playSongFromList} />)}
          </div>
        ) : <p className="text-secondary">No liked songs yet</p>}
      </section>

      <section className="page-section">
        <h2 className="section-title mb-2">Recently Played</h2>
        {data.userRecent && data.userRecent.length > 0 ? (
          <div className="card-grid cols-5">
            {data.userRecent.slice(0, 10).map((s) => <SongCard key={s.id} song={s} onPlay={playSongFromList} />)}
          </div>
        ) : <p className="text-secondary">No recently played songs</p>}
      </section>

      <section className="page-section">
        <h2 className="section-title mb-2">Followed Artists</h2>
        {data.userFollowed && data.userFollowed.length > 0 ? (
          <div className="card-grid cols-5">
            {data.userFollowed.map((a) => <ArtistCard key={a.id} artist={a} />)}
          </div>
        ) : <p className="text-secondary">You haven't followed any artists yet</p>}
      </section>

      <section className="page-section">
        <h2 className="section-title mb-2">Downloads</h2>
        {data.userDownloads && data.userDownloads.length > 0 ? (
          <div className="card-grid cols-5">
            {data.userDownloads.slice(0, 10).map((s) => <SongCard key={s.id} song={s} onPlay={playSongFromList} />)}
          </div>
        ) : <p className="text-secondary">No downloaded songs</p>}
      </section>

      {showCreate && (
        <Modal title="Create Playlist" onClose={() => setShowCreate(false)}>
          <div className="form-group">
            <label className="form-label">Playlist Name</label>
            <input className="form-input" value={newPl.name} onChange={(e) => setNewPl({ ...newPl, name: e.target.value })} placeholder="My Awesome Playlist" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={newPl.description} onChange={(e) => setNewPl({ ...newPl, description: e.target.value })} placeholder="What's this playlist about?" />
          </div>
          <div className="form-group">
            <label className="form-label">Cover Image URL (optional)</label>
            <input className="form-input" value={newPl.cover} onChange={(e) => setNewPl({ ...newPl, cover: e.target.value })} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Privacy</label>
            <select className="form-select" value={newPl.privacy} onChange={(e) => setNewPl({ ...newPl, privacy: e.target.value })}>
              <option>Public</option>
              <option>Private</option>
            </select>
          </div>
          <button className="btn btn-primary btn-full" onClick={createPlaylist}>Create</button>
        </Modal>
      )}
    </div>
  );
}
