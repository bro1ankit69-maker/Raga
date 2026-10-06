import { getData, saveData, KEYS, genId } from './localStorage.js';

const SAMPLE_AUDIO = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
];

const GENRES = [
  { id: 'g1', name: 'Pop', color: '#e91e63' },
  { id: 'g2', name: 'Rock', color: '#ff5722' },
  { id: 'g3', name: 'Hip Hop', color: '#ffc107' },
  { id: 'g4', name: 'EDM', color: '#00bcd4' },
  { id: 'g5', name: 'Jazz', color: '#795548' },
  { id: 'g6', name: 'Classical', color: '#9c27b0' },
  { id: 'g7', name: 'Lo-Fi', color: '#607d8b' },
  { id: 'g8', name: 'Bollywood', color: '#ff6f00' },
  { id: 'g9', name: 'Indie', color: '#4caf50' },
  { id: 'g10', name: 'R&B', color: '#3f51b5' },
];

const ARTISTS = [
  { id: 'a1', name: 'Aria Sky', bio: 'A soulful pop sensation known for heartfelt melodies and soaring vocals.', genre: 'Pop', image: 'https://i.pravatar.cc/300?img=47', followers: 1280000 },
  { id: 'a2', name: 'The Midnight Wolves', bio: 'A rock band that blends classic riffs with modern energy.', genre: 'Rock', image: 'https://i.pravatar.cc/300?img=12', followers: 890000 },
  { id: 'a3', name: 'D.J. Pulse', bio: 'An EDM producer pushing the boundaries of electronic music.', genre: 'EDM', image: 'https://i.pravatar.cc/300?img=33', followers: 2100000 },
  { id: 'a4', name: 'Luna Ray', bio: 'An R&B artist with smooth vocals and emotional depth.', genre: 'R&B', image: 'https://i.pravatar.cc/300?img=44', followers: 750000 },
  { id: 'a5', name: 'Marcus Cole', bio: 'A hip-hop artist with sharp lyrics and infectious beats.', genre: 'Hip Hop', image: 'https://i.pravatar.cc/300?img=53', followers: 3200000 },
  { id: 'a6', name: 'Ella Jazz', bio: 'A contemporary jazz vocalist revitalizing the genre.', genre: 'Jazz', image: 'https://i.pravatar.cc/300?img=29', followers: 420000 },
  { id: 'a7', name: 'Vienna Strings', bio: 'A classical ensemble performing timeless orchestral pieces.', genre: 'Classical', image: 'https://i.pravatar.cc/300?img=15', followers: 310000 },
  { id: 'a8', name: 'Chillhop Bear', bio: 'A lo-fi producer creating relaxing beats for study and focus.', genre: 'Lo-Fi', image: 'https://i.pravatar.cc/300?img=20', followers: 680000 },
  { id: 'a9', name: 'Riya Kapoor', bio: 'A Bollywood playback singer with a voice that captivates millions.', genre: 'Bollywood', image: 'https://i.pravatar.cc/300?img=48', followers: 4500000 },
  { id: 'a10', name: 'The Wanderers', bio: 'An indie band crafting authentic, raw, and emotional songs.', genre: 'Indie', image: 'https://i.pravatar.cc/300?img=60', followers: 560000 },
];

const ALBUMS = [
  { id: 'al1', title: 'Skylines', artistId: 'a1', artist: 'Aria Sky', genre: 'Pop', year: 2024, cover: 'https://picsum.photos/seed/skylines/400/400', songIds: [] },
  { id: 'al2', title: 'Howl', artistId: 'a2', artist: 'The Midnight Wolves', genre: 'Rock', year: 2023, cover: 'https://picsum.photos/seed/howl/400/400', songIds: [] },
  { id: 'al3', title: 'Neon Rush', artistId: 'a3', artist: 'D.J. Pulse', genre: 'EDM', year: 2024, cover: 'https://picsum.photos/seed/neonrush/400/400', songIds: [] },
  { id: 'al4', title: 'Velvet Nights', artistId: 'a4', artist: 'Luna Ray', genre: 'R&B', year: 2023, cover: 'https://picsum.photos/seed/velvet/400/400', songIds: [] },
  { id: 'al5', title: 'Concrete Dreams', artistId: 'a5', artist: 'Marcus Cole', genre: 'Hip Hop', year: 2024, cover: 'https://picsum.photos/seed/concrete/400/400', songIds: [] },
  { id: 'al6', title: 'Blue Moon Sessions', artistId: 'a6', artist: 'Ella Jazz', genre: 'Jazz', year: 2022, cover: 'https://picsum.photos/seed/bluemoon/400/400', songIds: [] },
  { id: 'al7', title: 'Symphony No. 9', artistId: 'a7', artist: 'Vienna Strings', genre: 'Classical', year: 2021, cover: 'https://picsum.photos/seed/symphony9/400/400', songIds: [] },
  { id: 'al8', title: 'Late Night Beats', artistId: 'a8', artist: 'Chillhop Bear', genre: 'Lo-Fi', year: 2024, cover: 'https://picsum.photos/seed/latenight/400/400', songIds: [] },
  { id: 'al9', title: 'Rang De', artistId: 'a9', artist: 'Riya Kapoor', genre: 'Bollywood', year: 2023, cover: 'https://picsum.photos/seed/rangde/400/400', songIds: [] },
  { id: 'al10', title: 'Roadside', artistId: 'a10', artist: 'The Wanderers', genre: 'Indie', year: 2024, cover: 'https://picsum.photos/seed/roadside/400/400', songIds: [] },
];

const SONG_DEFS = [
  { title: 'Golden Hour', artistId: 'a1', artist: 'Aria Sky', albumId: 'al1', album: 'Skylines', genre: 'Pop', year: 2024, duration: 215 },
  { title: 'City Lights', artistId: 'a1', artist: 'Aria Sky', albumId: 'al1', album: 'Skylines', genre: 'Pop', year: 2024, duration: 198 },
  { title: 'Echoes in the Dark', artistId: 'a2', artist: 'The Midnight Wolves', albumId: 'al2', album: 'Howl', genre: 'Rock', year: 2023, duration: 245 },
  { title: 'Thunder Road', artistId: 'a2', artist: 'The Midnight Wolves', albumId: 'al2', album: 'Howl', genre: 'Rock', year: 2023, duration: 232 },
  { title: 'Electric Dreams', artistId: 'a3', artist: 'D.J. Pulse', albumId: 'al3', album: 'Neon Rush', genre: 'EDM', year: 2024, duration: 280 },
  { title: 'Strobe Light', artistId: 'a3', artist: 'D.J. Pulse', albumId: 'al3', album: 'Neon Rush', genre: 'EDM', year: 2024, duration: 300 },
  { title: 'Slow Burn', artistId: 'a4', artist: 'Luna Ray', albumId: 'al4', album: 'Velvet Nights', genre: 'R&B', year: 2023, duration: 225 },
  { title: 'Midnight Confession', artistId: 'a4', artist: 'Luna Ray', albumId: 'al4', album: 'Velvet Nights', genre: 'R&B', year: 2023, duration: 210 },
  { title: 'Hustle Mode', artistId: 'a5', artist: 'Marcus Cole', albumId: 'al5', album: 'Concrete Dreams', genre: 'Hip Hop', year: 2024, duration: 190 },
  { title: 'Street Symphony', artistId: 'a5', artist: 'Marcus Cole', albumId: 'al5', album: 'Concrete Dreams', genre: 'Hip Hop', year: 2024, duration: 205 },
  { title: 'Autumn Leaves', artistId: 'a6', artist: 'Ella Jazz', albumId: 'al6', album: 'Blue Moon Sessions', genre: 'Jazz', year: 2022, duration: 260 },
  { title: 'Smooth Groove', artistId: 'a6', artist: 'Ella Jazz', albumId: 'al6', album: 'Blue Moon Sessions', genre: 'Jazz', year: 2022, duration: 240 },
  { title: 'Moonlight Sonata', artistId: 'a7', artist: 'Vienna Strings', albumId: 'al7', album: 'Symphony No. 9', genre: 'Classical', year: 2021, duration: 360 },
  { title: 'Adagio', artistId: 'a7', artist: 'Vienna Strings', albumId: 'al7', album: 'Symphony No. 9', genre: 'Classical', year: 2021, duration: 320 },
  { title: 'Rainy Day', artistId: 'a8', artist: 'Chillhop Bear', albumId: 'al8', album: 'Late Night Beats', genre: 'Lo-Fi', year: 2024, duration: 175 },
  { title: 'Coffee Shop Vibes', artistId: 'a8', artist: 'Chillhop Bear', albumId: 'al8', album: 'Late Night Beats', genre: 'Lo-Fi', year: 2024, duration: 190 },
  { title: 'Dil Se', artistId: 'a9', artist: 'Riya Kapoor', albumId: 'al9', album: 'Rang De', genre: 'Bollywood', year: 2023, duration: 255 },
  { title: 'Tum Hi Ho', artistId: 'a9', artist: 'Riya Kapoor', albumId: 'al9', album: 'Rang De', genre: 'Bollywood', year: 2023, duration: 270 },
  { title: 'Wandering Heart', artistId: 'a10', artist: 'The Wanderers', albumId: 'al10', album: 'Roadside', genre: 'Indie', year: 2024, duration: 220 },
  { title: 'Open Road', artistId: 'a10', artist: 'The Wanderers', albumId: 'al10', album: 'Roadside', genre: 'Indie', year: 2024, duration: 235 },
];

const PLAYLISTS = [
  { id: 'pl1', name: 'Top Hits 2024', description: 'The biggest tracks of the year', cover: 'https://picsum.photos/seed/tophits/400/400', privacy: 'Public', ownerId: 'user-demo', songIds: [] },
  { id: 'pl2', name: 'Workout Energy', description: 'Pump up your workout session', cover: 'https://picsum.photos/seed/workout/400/400', privacy: 'Public', ownerId: 'user-demo', songIds: [] },
  { id: 'pl3', name: 'Chill Vibes', description: 'Relax and unwind with these lo-fi tracks', cover: 'https://picsum.photos/seed/chillvibes/400/400', privacy: 'Public', ownerId: 'user-demo', songIds: [] },
  { id: 'pl4', name: 'Throwback Classics', description: 'Timeless hits that never get old', cover: 'https://picsum.photos/seed/throwback/400/400', privacy: 'Public', ownerId: 'user-demo', songIds: [] },
  { id: 'pl5', name: 'Focus & Study', description: 'Instrumental and lo-fi beats for deep focus', cover: 'https://picsum.photos/seed/focus/400/400', privacy: 'Public', ownerId: 'user-demo', songIds: [] },
  { id: 'pl6', name: 'Party Mix', description: 'High-energy tracks for your next party', cover: 'https://picsum.photos/seed/party/400/400', privacy: 'Public', ownerId: 'user-demo', songIds: [] },
  { id: 'pl7', name: 'Romantic Evenings', description: 'Smooth R&B and soul for special nights', cover: 'https://picsum.photos/seed/romantic/400/400', privacy: 'Public', ownerId: 'user-demo', songIds: [] },
  { id: 'pl8', name: 'Morning Motivation', description: 'Start your day with uplifting beats', cover: 'https://picsum.photos/seed/morning/400/400', privacy: 'Public', ownerId: 'user-demo', songIds: [] },
  { id: 'pl9', name: 'Indie Discoveries', description: 'Fresh indie tracks you need to hear', cover: 'https://picsum.photos/seed/indiedisc/400/400', privacy: 'Public', ownerId: 'user-demo', songIds: [] },
  { id: 'pl10', name: 'Bollywood Beats', description: 'The best of Bollywood music', cover: 'https://picsum.photos/seed/bollybeats/400/400', privacy: 'Public', ownerId: 'user-demo', songIds: [] },
];

export function seedData() {
  if (getData(KEYS.SEEDED)) return;

  // Users
  const users = [
    { id: 'admin-demo', name: 'Admin', email: 'admin@ragaplay.com', password: 'admin123', country: 'United States', dob: '1990-01-01', role: 'admin', createdAt: new Date().toISOString(), status: 'active' },
    { id: 'user-demo', name: 'Demo User', email: 'user@ragaplay.com', password: 'user123', country: 'United States', dob: '1995-05-15', role: 'user', createdAt: new Date().toISOString(), status: 'active' },
  ];
  saveData(KEYS.USERS, users);

  // Genres
  saveData(KEYS.GENRES, GENRES);

  // Artists
  saveData(KEYS.ARTISTS, ARTISTS);

  // Songs
  const songs = SONG_DEFS.map((s, i) => ({
    ...s,
    id: 's' + (i + 1),
    cover: ALBUMS.find((al) => al.id === s.albumId)?.cover || '',
    audioUrl: SAMPLE_AUDIO[i % SAMPLE_AUDIO.length],
    plays: Math.floor(Math.random() * 5000000) + 100000,
    featured: i < 6,
  }));
  saveData(KEYS.SONGS, songs);

  // Albums — link songIds
  const albums = ALBUMS.map((al) => ({
    ...al,
    songIds: songs.filter((s) => s.albumId === al.id).map((s) => s.id),
  }));
  saveData(KEYS.ALBUMS, albums);

  // Playlists — distribute songs
  const playlists = PLAYLISTS.map((pl, i) => ({
    ...pl,
    songIds: songs.filter((_, idx) => (idx + i) % 3 === 0).slice(0, 5).map((s) => s.id),
  }));
  saveData(KEYS.PLAYLISTS, playlists);

  // Featured content
  saveData(KEYS.FEATURED, {
    songs: songs.slice(0, 4).map((s) => s.id),
    albums: albums.slice(0, 4).map((a) => a.id),
    artists: ARTISTS.slice(0, 4).map((a) => a.id),
    trending: songs.slice(4, 10).map((s) => s.id),
  });

  // Per-user defaults
  saveData(KEYS.LIKED_SONGS, {});
  saveData(KEYS.RECENTLY_PLAYED, {});
  saveData(KEYS.DOWNLOADS, {});
  saveData(KEYS.FOLLOWED_ARTISTS, {});

  // Settings
  saveData(KEYS.SETTINGS, {
    darkMode: true,
    autoplay: true,
    audioQuality: 'High',
    notifications: true,
    language: 'English',
  });

  saveData(KEYS.SEEDED, true);
}

export { SAMPLE_AUDIO };
