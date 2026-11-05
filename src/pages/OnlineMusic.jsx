import { useState, useEffect } from 'react';
import { Play, Heart } from 'lucide-react';
import { usePlayer } from '../context/MusicPlayerContext.jsx';
import {
  useSearchMusicQuery,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from '../store/apiSlice.js';

function TrackCard({ song, isFav, onPlay, onToggleFav }) {
  return (
    <div className="song-card" onClick={() => onPlay(song)}>
      <img src={song.cover} alt={song.title} className="card-image" loading="lazy" />
      <div className="card-play-btn" onClick={(e) => { e.stopPropagation(); onPlay(song); }}>
        <Play size={20} fill="black" />
      </div>
      <div className="card-title">{song.title}</div>
      <div className="card-subtitle" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.artist}</span>
        <Heart
          size={16}
          fill={isFav ? '#1db954' : 'none'}
          color={isFav ? '#1db954' : 'currentColor'}
          style={{ flexShrink: 0, cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); onToggleFav(song, isFav); }}
        />
      </div>
    </div>
  );
}

export default function OnlineMusic() {
  const { playSong } = usePlayer();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  // Wait 400ms after typing stops before calling the API
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching, error } = useSearchMusicQuery(debounced, { skip: !debounced });
  const { data: favData } = useGetFavoritesQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const results = data?.results || [];
  const favorites = favData?.favorites || [];
  const favIds = new Set(favorites.map((f) => f.id));

  const toggleFav = (song, isFav) => (isFav ? removeFavorite(song.id) : addFavorite(song));

  return (
    <div>
      <h1 className="page-title">Online Music</h1>
      <p style={{ color: '#b3b3b3', marginBottom: '1rem' }}>
        Search millions of songs from the iTunes catalog and play 30-second previews. Hearted songs are saved to your account in MongoDB.
      </p>

      <div className="topbar-search" style={{ maxWidth: 'none', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any song or artist (e.g. Arijit Singh, Coldplay)..."
          style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.5rem' }}
          autoFocus
        />
      </div>

      {isFetching && <p style={{ color: '#b3b3b3' }}>Searching...</p>}
      {error && <div className="auth-error">{error.data?.error || 'Could not load music. Please try again.'}</div>}

      {debounced && !isFetching && !error && results.length === 0 && (
        <div className="empty-state"><h3>No results for "{debounced}"</h3></div>
      )}

      {results.length > 0 && (
        <section className="page-section">
          <h2 className="section-title mb-2">Results</h2>
          <div className="card-grid cols-5">
            {results.map((s) => (
              <TrackCard key={s.id} song={s} isFav={favIds.has(s.id)}
                onPlay={(song) => playSong(song, results)} onToggleFav={toggleFav} />
            ))}
          </div>
        </section>
      )}

      <section className="page-section">
        <h2 className="section-title mb-2">Your saved songs</h2>
        {favorites.length === 0 ? (
          <p style={{ color: '#b3b3b3' }}>Tap the heart on a song to save it here.</p>
        ) : (
          <div className="card-grid cols-5">
            {favorites.map((s) => (
              <TrackCard key={s.id} song={s} isFav
                onPlay={(song) => playSong(song, favorites)} onToggleFav={toggleFav} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
