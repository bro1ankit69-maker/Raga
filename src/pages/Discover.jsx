import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getData, KEYS } from '../utils/localStorage.js';
import { SongCard, AlbumCard, ArtistCard } from '../components/Cards.jsx';
import { usePlayer } from '../context/MusicPlayerContext.jsx';

export default function Discover() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({});
  const { playSong } = usePlayer();
  const selectedGenre = params.get('genre') || 'All';

  useEffect(() => {
    const songs = getData(KEYS.SONGS) || [];
    const albums = getData(KEYS.ALBUMS) || [];
    const artists = getData(KEYS.ARTISTS) || [];
    const genres = getData(KEYS.GENRES) || [];
    setData({ songs, albums, artists, genres });
  }, []);

  const filteredSongs = selectedGenre === 'All'
    ? data.songs || []
    : (data.songs || []).filter((s) => s.genre === selectedGenre);

  const filteredAlbums = selectedGenre === 'All'
    ? data.albums || []
    : (data.albums || []).filter((a) => a.genre === selectedGenre);

  const filteredArtists = selectedGenre === 'All'
    ? data.artists || []
    : (data.artists || []).filter((a) => a.genre === selectedGenre);

  const playSongFromList = (song) => {
    const songs = getData(KEYS.SONGS) || [];
    playSong(song, songs);
  };

  return (
    <div>
      <h1 className="page-title">Discover</h1>

      <div className="search-filters">
        <button className={`filter-chip ${selectedGenre === 'All' ? 'active' : ''}`}
          onClick={() => setParams({})}>All</button>
        {(data.genres || []).map((g) => (
          <button key={g.id} className={`filter-chip ${selectedGenre === g.name ? 'active' : ''}`}
            onClick={() => setParams({ genre: g.name })}>{g.name}</button>
        ))}
      </div>

      {filteredArtists.length > 0 && (
        <section className="page-section">
          <h2 className="section-title mb-2">Artists {selectedGenre !== 'All' && `· ${selectedGenre}`}</h2>
          <div className="card-grid cols-5">
            {filteredArtists.map((a) => <ArtistCard key={a.id} artist={a} />)}
          </div>
        </section>
      )}

      {filteredAlbums.length > 0 && (
        <section className="page-section">
          <h2 className="section-title mb-2">Albums {selectedGenre !== 'All' && `· ${selectedGenre}`}</h2>
          <div className="card-grid cols-5">
            {filteredAlbums.map((a) => <AlbumCard key={a.id} album={a} />)}
          </div>
        </section>
      )}

      <section className="page-section">
        <h2 className="section-title mb-2">Songs {selectedGenre !== 'All' && `· ${selectedGenre}`}</h2>
        <div className="card-grid cols-5">
          {filteredSongs.map((s) => <SongCard key={s.id} song={s} onPlay={playSongFromList} />)}
        </div>
      </section>
    </div>
  );
}
