/*
# RagaPlay Music Streaming Platform - Complete Database Schema

1. Purpose
   Creates the full database backing for the RagaPlay music streaming platform.
   The app uses LocalStorage as its primary data layer for the college project,
   but this database serves as the persistent server-side store mirroring the
   same data model (users, songs, albums, artists, genres, playlists, and all
   per-user relationship data).

2. New Tables
   - `genres`          — music genres (Pop, Rock, Hip Hop, EDM, etc.)
   - `artists`         — music artists with bios, genres, follower counts
   - `albums`          — albums linked to artists
   - `songs`           — songs linked to artists and albums, with play counts
   - `users`           — application users (not Supabase auth; the app manages its own auth via LocalStorage)
   - `playlists`       — user-created playlists with privacy settings
   - `playlist_songs`  — junction table mapping songs to playlists with ordering
   - `liked_songs`     — per-user liked song relationships
   - `recently_played` — per-user play history (limited to 20 per user)
   - `downloads`       — per-user offline download simulation records
   - `followed_artists`— per-user artist follow relationships
   - `user_settings`   — per-user settings (dark mode, autoplay, audio quality, etc.)
   - `featured_content`— admin-curated featured songs, albums, artists, and trending content

3. Security
   - RLS enabled on every table.
   - The app does NOT use Supabase Auth — it manages its own auth via LocalStorage.
     Therefore all policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
     because the database is accessed via the anon key and all data is intentionally shared
     across the application (single-tenant from the database's perspective).

4. Important Notes
   - Uses text primary keys (e.g. 's1', 'a1') to match the existing LocalStorage ID scheme.
   - Foreign keys enforce referential integrity between artists/albums/songs.
   - `playlist_songs` includes a `position` column for song ordering within playlists.
   - `recently_played` uses an auto-incrementing id so multiple plays of the same song are preserved.
*/

-- ===== Genres =====
CREATE TABLE IF NOT EXISTS genres (
  id text PRIMARY KEY,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#1db954'
);

ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_genres" ON genres;
CREATE POLICY "anon_select_genres" ON genres FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_genres" ON genres;
CREATE POLICY "anon_insert_genres" ON genres FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_genres" ON genres;
CREATE POLICY "anon_update_genres" ON genres FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_genres" ON genres;
CREATE POLICY "anon_delete_genres" ON genres FOR DELETE TO anon, authenticated USING (true);

-- ===== Artists =====
CREATE TABLE IF NOT EXISTS artists (
  id text PRIMARY KEY,
  name text NOT NULL,
  bio text DEFAULT '',
  genre text DEFAULT '',
  image text DEFAULT '',
  followers integer DEFAULT 0
);

ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_artists" ON artists;
CREATE POLICY "anon_select_artists" ON artists FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_artists" ON artists;
CREATE POLICY "anon_insert_artists" ON artists FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_artists" ON artists;
CREATE POLICY "anon_update_artists" ON artists FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_artists" ON artists;
CREATE POLICY "anon_delete_artists" ON artists FOR DELETE TO anon, authenticated USING (true);

-- ===== Albums =====
CREATE TABLE IF NOT EXISTS albums (
  id text PRIMARY KEY,
  title text NOT NULL,
  artist_id text REFERENCES artists(id) ON DELETE SET NULL,
  artist text DEFAULT '',
  genre text DEFAULT '',
  year integer,
  cover text DEFAULT ''
);

ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_albums" ON albums;
CREATE POLICY "anon_select_albums" ON albums FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_albums" ON albums;
CREATE POLICY "anon_insert_albums" ON albums FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_albums" ON albums;
CREATE POLICY "anon_update_albums" ON albums FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_albums" ON albums;
CREATE POLICY "anon_delete_albums" ON albums FOR DELETE TO anon, authenticated USING (true);

-- ===== Songs =====
CREATE TABLE IF NOT EXISTS songs (
  id text PRIMARY KEY,
  title text NOT NULL,
  artist_id text REFERENCES artists(id) ON DELETE SET NULL,
  artist text DEFAULT '',
  album_id text REFERENCES albums(id) ON DELETE SET NULL,
  album text DEFAULT '',
  genre text DEFAULT '',
  year integer,
  duration integer DEFAULT 200,
  cover text DEFAULT '',
  audio_url text DEFAULT '',
  plays bigint DEFAULT 0,
  featured boolean DEFAULT false
);

ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_songs" ON songs;
CREATE POLICY "anon_select_songs" ON songs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_songs" ON songs;
CREATE POLICY "anon_insert_songs" ON songs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_songs" ON songs;
CREATE POLICY "anon_update_songs" ON songs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_songs" ON songs;
CREATE POLICY "anon_delete_songs" ON songs FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_album_id ON songs(album_id);
CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs(genre);

-- ===== Users (app-level users, not Supabase auth) =====
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  country text DEFAULT '',
  dob text DEFAULT '',
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active'
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_users" ON users;
CREATE POLICY "anon_select_users" ON users FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_users" ON users;
CREATE POLICY "anon_insert_users" ON users FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_users" ON users;
CREATE POLICY "anon_update_users" ON users FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_users" ON users;
CREATE POLICY "anon_delete_users" ON users FOR DELETE TO anon, authenticated USING (true);

-- ===== Playlists =====
CREATE TABLE IF NOT EXISTS playlists (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text DEFAULT '',
  cover text DEFAULT '',
  privacy text NOT NULL DEFAULT 'Public',
  owner_id text NOT NULL
);

ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_playlists" ON playlists;
CREATE POLICY "anon_select_playlists" ON playlists FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_playlists" ON playlists;
CREATE POLICY "anon_insert_playlists" ON playlists FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_playlists" ON playlists;
CREATE POLICY "anon_update_playlists" ON playlists FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_playlists" ON playlists;
CREATE POLICY "anon_delete_playlists" ON playlists FOR DELETE TO anon, authenticated USING (true);

-- ===== Playlist Songs (junction with ordering) =====
CREATE TABLE IF NOT EXISTS playlist_songs (
  playlist_id text NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  song_id text NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  PRIMARY KEY (playlist_id, song_id)
);

ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_playlist_songs" ON playlist_songs;
CREATE POLICY "anon_select_playlist_songs" ON playlist_songs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_playlist_songs" ON playlist_songs;
CREATE POLICY "anon_insert_playlist_songs" ON playlist_songs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_playlist_songs" ON playlist_songs;
CREATE POLICY "anon_update_playlist_songs" ON playlist_songs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_playlist_songs" ON playlist_songs;
CREATE POLICY "anon_delete_playlist_songs" ON playlist_songs FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist_id ON playlist_songs(playlist_id);

-- ===== Liked Songs =====
CREATE TABLE IF NOT EXISTS liked_songs (
  user_id text NOT NULL,
  song_id text NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  liked_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, song_id)
);

ALTER TABLE liked_songs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_liked_songs" ON liked_songs;
CREATE POLICY "anon_select_liked_songs" ON liked_songs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_liked_songs" ON liked_songs;
CREATE POLICY "anon_insert_liked_songs" ON liked_songs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_liked_songs" ON liked_songs;
CREATE POLICY "anon_delete_liked_songs" ON liked_songs FOR DELETE TO anon, authenticated USING (true);

-- ===== Recently Played =====
CREATE TABLE IF NOT EXISTS recently_played (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  song_id text NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  played_at timestamptz DEFAULT now()
);

ALTER TABLE recently_played ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_recently_played" ON recently_played;
CREATE POLICY "anon_select_recently_played" ON recently_played FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_recently_played" ON recently_played;
CREATE POLICY "anon_insert_recently_played" ON recently_played FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_recently_played" ON recently_played;
CREATE POLICY "anon_delete_recently_played" ON recently_played FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_recently_played_user_id ON recently_played(user_id, played_at DESC);

-- ===== Downloads =====
CREATE TABLE IF NOT EXISTS downloads (
  user_id text NOT NULL,
  song_id text NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  downloaded_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, song_id)
);

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_downloads" ON downloads;
CREATE POLICY "anon_select_downloads" ON downloads FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_downloads" ON downloads;
CREATE POLICY "anon_insert_downloads" ON downloads FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_downloads" ON downloads;
CREATE POLICY "anon_delete_downloads" ON downloads FOR DELETE TO anon, authenticated USING (true);

-- ===== Followed Artists =====
CREATE TABLE IF NOT EXISTS followed_artists (
  user_id text NOT NULL,
  artist_id text NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  followed_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, artist_id)
);

ALTER TABLE followed_artists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_followed_artists" ON followed_artists;
CREATE POLICY "anon_select_followed_artists" ON followed_artists FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_followed_artists" ON followed_artists;
CREATE POLICY "anon_insert_followed_artists" ON followed_artists FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_followed_artists" ON followed_artists;
CREATE POLICY "anon_delete_followed_artists" ON followed_artists FOR DELETE TO anon, authenticated USING (true);

-- ===== User Settings =====
CREATE TABLE IF NOT EXISTS user_settings (
  user_id text PRIMARY KEY,
  dark_mode boolean DEFAULT true,
  autoplay boolean DEFAULT true,
  audio_quality text DEFAULT 'High',
  notifications boolean DEFAULT true,
  language text DEFAULT 'English'
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_user_settings" ON user_settings;
CREATE POLICY "anon_select_user_settings" ON user_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_user_settings" ON user_settings;
CREATE POLICY "anon_insert_user_settings" ON user_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_user_settings" ON user_settings;
CREATE POLICY "anon_update_user_settings" ON user_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_user_settings" ON user_settings;
CREATE POLICY "anon_delete_user_settings" ON user_settings FOR DELETE TO anon, authenticated USING (true);

-- ===== Featured Content =====
CREATE TABLE IF NOT EXISTS featured_content (
  id integer PRIMARY KEY DEFAULT 1,
  songs text[] DEFAULT '{}',
  albums text[] DEFAULT '{}',
  artists text[] DEFAULT '{}',
  trending text[] DEFAULT '{}',
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE featured_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_featured" ON featured_content;
CREATE POLICY "anon_select_featured" ON featured_content FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_featured" ON featured_content;
CREATE POLICY "anon_insert_featured" ON featured_content FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_featured" ON featured_content;
CREATE POLICY "anon_update_featured" ON featured_content FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_featured" ON featured_content;
CREATE POLICY "anon_delete_featured" ON featured_content FOR DELETE TO anon, authenticated USING (true);
