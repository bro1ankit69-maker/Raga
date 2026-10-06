import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData, KEYS } from '../utils/localStorage.js';
import { usePlayer } from '../context/MusicPlayerContext.jsx';
import { SongCard, AlbumCard, ArtistCard, PlaylistCard } from '../components/Cards.jsx';

export default function Search() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [results, setResults] = useState({});
  const { playSong } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    const songs = getData(KEYS.SONGS) || [];
    const albums = getData(KEYS.ALBUMS) || [];
    const artists = getData(KEYS.ARTISTS) || [];
    const genres = getData(KEYS.GENRES) || [];
    const playlists = (getData(KEYS.PLAYLISTS) || []).filter((p) => p.privacy === 'Public');

    if (!query.trim()) {
      setResults({ songs: [], albums: [], artists: [], genres: [], playlists: [] });
      return;
    }

    const q = query.toLowerCase();
    setResults({
      songs: songs.filter((s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)),
      albums: albums.filter((a) => a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q)),
      artists: artists.filter((a) => a.name.toLowerCase().includes(q)),
      genres: genres.filter((g) => g.name.toLowerCase().includes(q)),
      playlists: playlists.filter((p) => p.name.toLowerCase().includes(q)),
    });
  }, [query]);

  const filters = ['All', 'Songs', 'Albums', 'Artists', 'Playlists'];
  const hasResults = Object.values(results).some((arr) => arr && arr.length > 0);

  const playSongFromList = (song) => {
    const songs = getData(KEYS.SONGS) || [];
    playSong(song, songs);
  };

  return (
    <div>
      <h1 className="page-title">Search</h1>

      <div className="topbar-search" style={{ maxWidth: 'none', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs, albums, artists, playlists..."
          style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.5rem' }}
          autoFocus
        />
      </div>

      {query && (
        <div className="search-filters">
          {filters.map((f) => (
            <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      )}

      {!query && (
        <div className="empty-state">
          <h3>Search for your favorite music</h3>
          <p>Try searching for "Golden Hour", "Aria Sky", or "Rock"</p>
        </div>
      )}

      {query && !hasResults && (
        <div className="empty-state">
          <h3>No results found for "{query}"</h3>
          <p>Try a different search term</p>
        </div>
      )}

      {hasResults && (filter === 'All' || filter === 'Songs') && results.songs?.length > 0 && (
        <section className="page-section">
          <h2 className="section-title mb-2">Songs</h2>
          <div className="card-grid cols-5">
            {results.songs.map((s) => <SongCard key={s.id} song={s} onPlay={playSongFromList} />)}
          </div>
        </section>
      )}

      {hasResults && (filter === 'All' || filter === 'Albums') && results.albums?.length > 0 && (
        <section className="page-section">
          <h2 className="section-title mb-2">Albums</h2>
          <div className="card-grid cols-5">
            {results.albums.map((a) => <AlbumCard key={a.id} album={a} />)}
          </div>
        </section>
      )}

      {hasResults && (filter === 'All' || filter === 'Artists') && results.artists?.length > 0 && (
        <section className="page-section">
          <h2 className="section-title mb-2">Artists</h2>
          <div className="card-grid cols-5">
            {results.artists.map((a) => <ArtistCard key={a.id} artist={a} />)}
          </div>
        </section>
      )}

      {hasResults && (filter === 'All' || filter === 'Playlists') && results.playlists?.length > 0 && (
        <section className="page-section">
          <h2 className="section-title mb-2">Playlists</h2>
          <div className="card-grid cols-5">
            {results.playlists.map((p) => <PlaylistCard key={p.id} playlist={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
