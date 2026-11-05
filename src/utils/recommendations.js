import { getData, KEYS } from './localStorage.js';

export function getRecommendations(userId) {
  const songs = getData(KEYS.SONGS) || [];
  const albums = getData(KEYS.ALBUMS) || [];
  const liked = getData(KEYS.LIKED_SONGS) || {};
  const recent = getData(KEYS.RECENTLY_PLAYED) || {};
  const followed = getData(KEYS.FOLLOWED_ARTISTS) || {};

  const likedIds = liked[userId] || [];
  const recentIds = (recent[userId] || []).map((r) => r.songId);
  const followedIds = followed[userId] || [];

  const listenedSongs = songs.filter((s) => likedIds.includes(s.id) || recentIds.includes(s.id));

  const genreCount = {};
  listenedSongs.forEach((s) => {
    genreCount[s.genre] = (genreCount[s.genre] || 0) + 1;
  });

  const topGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .map(([g]) => g);

  const listenedIds = new Set([...likedIds, ...recentIds]);

  let recommended = songs.filter((s) => !listenedIds.has(s.id));

  if (topGenres.length > 0) {
    recommended.sort((a, b) => {
      const aRank = topGenres.indexOf(a.genre);
      const bRank = topGenres.indexOf(b.genre);
      if (aRank === -1 && bRank === -1) return b.plays - a.plays;
      if (aRank === -1) return 1;
      if (bRank === -1) return -1;
      return aRank - bRank;
    });
  } else {
    recommended = [...recommended].sort((a, b) => b.plays - a.plays);
  }

  const madeForYou = recommended.slice(0, 8);

  const topGenreName = topGenres[0];
  const becauseYouListen = topGenreName
    ? recommended.filter((s) => s.genre === topGenreName).slice(0, 6)
    : songs.filter((s) => s.featured).slice(0, 6);

  const followedArtistsSongs = songs
    .filter((s) => followedIds.includes(s.artistId))
    .slice(0, 6);

  const recommendedAlbums = albums.filter((al) =>
    al.songIds.some((sid) => recommended.some((s) => s.id === sid))
  ).slice(0, 6);

  const label = topGenreName
    ? `Because you listen to ${topGenreName}`
    : 'Popular right now';

  return {
    madeForYou,
    becauseYouListen,
    followedArtistsSongs,
    recommendedAlbums,
    topGenres,
    label,
  };
}
