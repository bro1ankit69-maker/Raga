const PREFIX = 'ragaplay_';

export const KEYS = {
  USERS: 'users',
  CURRENT_USER: 'currentUser',
  SONGS: 'songs',
  ALBUMS: 'albums',
  ARTISTS: 'artists',
  GENRES: 'genres',
  PLAYLISTS: 'playlists',
  LIKED_SONGS: 'likedSongs',
  RECENTLY_PLAYED: 'recentlyPlayed',
  DOWNLOADS: 'downloads',
  FOLLOWED_ARTISTS: 'followedArtists',
  SETTINGS: 'settings',
  FEATURED: 'featuredContent',
  SEEDED: 'seeded',
};

export function getData(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveData(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function updateData(key, updater) {
  const current = getData(key) ?? [];
  const next = typeof updater === 'function' ? updater(current) : updater;
  saveData(key, next);
  return next;
}

export function deleteData(key) {
  localStorage.removeItem(PREFIX + key);
}

export function clearAll() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(PREFIX + k));
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
