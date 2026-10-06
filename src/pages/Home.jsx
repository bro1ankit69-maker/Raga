import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData, KEYS } from '../utils/localStorage.js';
import { useAuth } from '../context/AuthContext.jsx';
import { usePlayer } from '../context/MusicPlayerContext.jsx';
import { getRecommendations } from '../utils/recommendations.js';
import { SongCard, AlbumCard, ArtistCard } from '../components/Cards.jsx';

export default function Home() {
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const navigate = useNavigate();
  const [data, setData] = useState({});

  useEffect(() => {
    const songs = getData(KEYS.SONGS) || [];
    const albums = getData(KEYS.ALBUMS) || [];
    const artists = getData(KEYS.ARTISTS) || [];
    const genres = getData(KEYS.GENRES) || [];
    const recent = getData(KEYS.RECENTLY_PLAYED) || {};
    const featured = getData(KEYS.FEATURED) || {};
    const followed = getData(KEYS.FOLLOWED_ARTISTS) || {};

    const userRecent = (recent[user?.id] || []).map((r) => songs.find((s) => s.id === r.songId)).filter(Boolean);
    const featuredSongs = (featured.songs || []).map((id) => songs.find((s) => s.id === id)).filter(Boolean);
    const trending = (featured.trending || []).map((id) => songs.find((s) => s.id === id)).filter(Boolean);
    const featuredAlbums = (featured.albums || []).map((id) => albums.find((a) => a.id === id)).filter(Boolean);
    const featuredArtists = (featured.artists || []).map((id) => artists.find((a) => a.id === id)).filter(Boolean);

    const recs = getRecommendations(user?.id);

    setData({
      songs, albums, artists, genres,
      userRecent, featuredSongs, trending, featuredAlbums, featuredArtists,
      recs,
    });
  }, [user]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  const playSongFromList = (song) => {
    const list = data.songs || [];
    playSong(song, list);
  };

  return (
    <div>
      <h1 className="greeting">{greeting}, {firstName}</h1>

      {data.userRecent && data.userRecent.length > 0 && (
        <section className="page-section">
          <div className="section-header">
            <h2 className="section-title">Recently Played</h2>
          </div>
          <div className="card-grid cols-5">
            {data.userRecent.slice(0, 5).map((s) => (
              <SongCard key={s.id} song={s} onPlay={playSongFromList} />
            ))}
          </div>
        </section>
      )}

      <section className="page-section">
        <div className="section-header">
          <h2 className="section-title">Made For You</h2>
        </div>
        <div className="card-grid cols-5">
          {(data.recs?.madeForYou || data.featuredSongs || []).slice(0, 5).map((s) => (
            <SongCard key={s.id} song={s} onPlay={playSongFromList} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <h2 className="section-title">{data.recs?.label || 'Trending Now'}</h2>
        </div>
        <div className="card-grid cols-5">
          {(data.recs?.becauseYouListen || data.trending || []).slice(0, 5).map((s) => (
            <SongCard key={s.id} song={s} onPlay={playSongFromList} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <h2 className="section-title">Trending Now</h2>
        </div>
        <div className="card-grid cols-5">
          {(data.trending || []).slice(0, 5).map((s) => (
            <SongCard key={s.id} song={s} onPlay={playSongFromList} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <h2 className="section-title">Popular Artists</h2>
        </div>
        <div className="card-grid cols-5">
          {(data.featuredArtists || data.artists || []).slice(0, 5).map((a) => (
            <ArtistCard key={a.id} artist={a} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <h2 className="section-title">Recommended Albums</h2>
        </div>
        <div className="card-grid cols-5">
          {(data.recs?.recommendedAlbums || data.featuredAlbums || data.albums || []).slice(0, 5).map((a) => (
            <AlbumCard key={a.id} album={a} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <h2 className="section-title">Browse Genres</h2>
        </div>
        <div className="card-grid cols-5">
          {(data.genres || []).map((g) => (
            <div key={g.id} className="genre-card" style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color}99)` }}
              onClick={() => navigate(`/discover?genre=${g.name}`)}>
              {g.name}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
