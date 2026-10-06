/*
# Seed RagaPlay Demo Data

1. Purpose
   Populates all tables with the same realistic demo data used by the
   LocalStorage seed in the frontend: 2 users, 10 genres, 10 artists,
   10 albums, 20 songs, 10 playlists with song mappings, and featured content.

2. Tables Populated
   - `genres`            — 10 genres (Pop, Rock, Hip Hop, EDM, etc.)
   - `artists`           — 10 artists with bios, images, follower counts
   - `albums`            — 10 albums linked to artists
   - `songs`             — 20 songs linked to artists and albums
   - `users`             — 2 demo users (admin + regular user)
   - `playlists`         — 10 playlists
   - `playlist_songs`    — song-to-playlist mappings with positions
   - `featured_content`  — featured songs, albums, artists, trending

3. Important Notes
   - Uses INSERT ... ON CONFLICT DO NOTHING so re-running is safe.
   - IDs match the frontend scheme (g1, a1, al1, s1, pl1, etc.).
*/

INSERT INTO genres (id, name, color) VALUES
  ('g1','Pop','#e91e63'),('g2','Rock','#ff5722'),('g3','Hip Hop','#ffc107'),
  ('g4','EDM','#00bcd4'),('g5','Jazz','#795548'),('g6','Classical','#9c27b0'),
  ('g7','Lo-Fi','#607d8b'),('g8','Bollywood','#ff6f00'),('g9','Indie','#4caf50'),
  ('g10','R&B','#3f51b5')
ON CONFLICT (id) DO NOTHING;

INSERT INTO artists (id, name, bio, genre, image, followers) VALUES
  ('a1','Aria Sky','A soulful pop sensation known for heartfelt melodies and soaring vocals.','Pop','https://i.pravatar.cc/300?img=47',1280000),
  ('a2','The Midnight Wolves','A rock band that blends classic riffs with modern energy.','Rock','https://i.pravatar.cc/300?img=12',890000),
  ('a3','D.J. Pulse','An EDM producer pushing the boundaries of electronic music.','EDM','https://i.pravatar.cc/300?img=33',2100000),
  ('a4','Luna Ray','An R&B artist with smooth vocals and emotional depth.','R&B','https://i.pravatar.cc/300?img=44',750000),
  ('a5','Marcus Cole','A hip-hop artist with sharp lyrics and infectious beats.','Hip Hop','https://i.pravatar.cc/300?img=53',3200000),
  ('a6','Ella Jazz','A contemporary jazz vocalist revitalizing the genre.','Jazz','https://i.pravatar.cc/300?img=29',420000),
  ('a7','Vienna Strings','A classical ensemble performing timeless orchestral pieces.','Classical','https://i.pravatar.cc/300?img=15',310000),
  ('a8','Chillhop Bear','A lo-fi producer creating relaxing beats for study and focus.','Lo-Fi','https://i.pravatar.cc/300?img=20',680000),
  ('a9','Riya Kapoor','A Bollywood playback singer with a voice that captivates millions.','Bollywood','https://i.pravatar.cc/300?img=48',4500000),
  ('a10','The Wanderers','An indie band crafting authentic, raw, and emotional songs.','Indie','https://i.pravatar.cc/300?img=60',560000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO albums (id, title, artist_id, artist, genre, year, cover) VALUES
  ('al1','Skylines','a1','Aria Sky','Pop',2024,'https://picsum.photos/seed/skylines/400/400'),
  ('al2','Howl','a2','The Midnight Wolves','Rock',2023,'https://picsum.photos/seed/howl/400/400'),
  ('al3','Neon Rush','a3','D.J. Pulse','EDM',2024,'https://picsum.photos/seed/neonrush/400/400'),
  ('al4','Velvet Nights','a4','Luna Ray','R&B',2023,'https://picsum.photos/seed/velvet/400/400'),
  ('al5','Concrete Dreams','a5','Marcus Cole','Hip Hop',2024,'https://picsum.photos/seed/concrete/400/400'),
  ('al6','Blue Moon Sessions','a6','Ella Jazz','Jazz',2022,'https://picsum.photos/seed/bluemoon/400/400'),
  ('al7','Symphony No. 9','a7','Vienna Strings','Classical',2021,'https://picsum.photos/seed/symphony9/400/400'),
  ('al8','Late Night Beats','a8','Chillhop Bear','Lo-Fi',2024,'https://picsum.photos/seed/latenight/400/400'),
  ('al9','Rang De','a9','Riya Kapoor','Bollywood',2023,'https://picsum.photos/seed/rangde/400/400'),
  ('al10','Roadside','a10','The Wanderers','Indie',2024,'https://picsum.photos/seed/roadside/400/400')
ON CONFLICT (id) DO NOTHING;

INSERT INTO songs (id, title, artist_id, artist, album_id, album, genre, year, duration, cover, audio_url, plays, featured) VALUES
  ('s1','Golden Hour','a1','Aria Sky','al1','Skylines','Pop',2024,215,'https://picsum.photos/seed/skylines/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',1523400,true),
  ('s2','City Lights','a1','Aria Sky','al1','Skylines','Pop',2024,198,'https://picsum.photos/seed/skylines/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',980000,true),
  ('s3','Echoes in the Dark','a2','The Midnight Wolves','al2','Howl','Rock',2023,245,'https://picsum.photos/seed/howl/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',720000,true),
  ('s4','Thunder Road','a2','The Midnight Wolves','al2','Howl','Rock',2023,232,'https://picsum.photos/seed/howl/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',650000,true),
  ('s5','Electric Dreams','a3','D.J. Pulse','al3','Neon Rush','EDM',2024,280,'https://picsum.photos/seed/neonrush/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',2100000,true),
  ('s6','Strobe Light','a3','D.J. Pulse','al3','Neon Rush','EDM',2024,300,'https://picsum.photos/seed/neonrush/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',1850000,true),
  ('s7','Slow Burn','a4','Luna Ray','al4','Velvet Nights','R&B',2023,225,'https://picsum.photos/seed/velvet/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',420000,false),
  ('s8','Midnight Confession','a4','Luna Ray','al4','Velvet Nights','R&B',2023,210,'https://picsum.photos/seed/velvet/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',380000,false),
  ('s9','Hustle Mode','a5','Marcus Cole','al5','Concrete Dreams','Hip Hop',2024,190,'https://picsum.photos/seed/concrete/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',3100000,false),
  ('s10','Street Symphony','a5','Marcus Cole','al5','Concrete Dreams','Hip Hop',2024,205,'https://picsum.photos/seed/concrete/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',2400000,false),
  ('s11','Autumn Leaves','a6','Ella Jazz','al6','Blue Moon Sessions','Jazz',2022,260,'https://picsum.photos/seed/bluemoon/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',180000,false),
  ('s12','Smooth Groove','a6','Ella Jazz','al6','Blue Moon Sessions','Jazz',2022,240,'https://picsum.photos/seed/bluemoon/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',150000,false),
  ('s13','Moonlight Sonata','a7','Vienna Strings','al7','Symphony No. 9','Classical',2021,360,'https://picsum.photos/seed/symphony9/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',95000,false),
  ('s14','Adagio','a7','Vienna Strings','al7','Symphony No. 9','Classical',2021,320,'https://picsum.photos/seed/symphony9/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',80000,false),
  ('s15','Rainy Day','a8','Chillhop Bear','al8','Late Night Beats','Lo-Fi',2024,175,'https://picsum.photos/seed/latenight/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',520000,false),
  ('s16','Coffee Shop Vibes','a8','Chillhop Bear','al8','Late Night Beats','Lo-Fi',2024,190,'https://picsum.photos/seed/latenight/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',480000,false),
  ('s17','Dil Se','a9','Riya Kapoor','al9','Rang De','Bollywood',2023,255,'https://picsum.photos/seed/rangde/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',3800000,false),
  ('s18','Tum Hi Ho','a9','Riya Kapoor','al9','Rang De','Bollywood',2023,270,'https://picsum.photos/seed/rangde/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',3200000,false),
  ('s19','Wandering Heart','a10','The Wanderers','al10','Roadside','Indie',2024,220,'https://picsum.photos/seed/roadside/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',340000,false),
  ('s20','Open Road','a10','The Wanderers','al10','Roadside','Indie',2024,235,'https://picsum.photos/seed/roadside/400/400','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',290000,false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, email, password, country, dob, role, status) VALUES
  ('admin-demo','Admin','admin@ragaplay.com','admin123','United States','1990-01-01','admin','active'),
  ('user-demo','Demo User','user@ragaplay.com','user123','United States','1995-05-15','user','active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO playlists (id, name, description, cover, privacy, owner_id) VALUES
  ('pl1','Top Hits 2024','The biggest tracks of the year','https://picsum.photos/seed/tophits/400/400','Public','user-demo'),
  ('pl2','Workout Energy','Pump up your workout session','https://picsum.photos/seed/workout/400/400','Public','user-demo'),
  ('pl3','Chill Vibes','Relax and unwind with these lo-fi tracks','https://picsum.photos/seed/chillvibes/400/400','Public','user-demo'),
  ('pl4','Throwback Classics','Timeless hits that never get old','https://picsum.photos/seed/throwback/400/400','Public','user-demo'),
  ('pl5','Focus & Study','Instrumental and lo-fi beats for deep focus','https://picsum.photos/seed/focus/400/400','Public','user-demo'),
  ('pl6','Party Mix','High-energy tracks for your next party','https://picsum.photos/seed/party/400/400','Public','user-demo'),
  ('pl7','Romantic Evenings','Smooth R&B and soul for special nights','https://picsum.photos/seed/romantic/400/400','Public','user-demo'),
  ('pl8','Morning Motivation','Start your day with uplifting beats','https://picsum.photos/seed/morning/400/400','Public','user-demo'),
  ('pl9','Indie Discoveries','Fresh indie tracks you need to hear','https://picsum.photos/seed/indiedisc/400/400','Public','user-demo'),
  ('pl10','Bollywood Beats','The best of Bollywood music','https://picsum.photos/seed/bollybeats/400/400','Public','user-demo')
ON CONFLICT (id) DO NOTHING;

-- Playlist songs: distribute songs across playlists (matching frontend logic)
-- pl1 gets s1,s4,s7,s10,s13  (idx+0)%3==0
INSERT INTO playlist_songs (playlist_id, song_id, position) VALUES
  ('pl1','s1',0),('pl1','s4',1),('pl1','s7',2),('pl1','s10',3),('pl1','s13',4),
  ('pl2','s3',0),('pl2','s6',1),('pl2','s9',2),('pl2','s12',3),('pl2','s15',4),
  ('pl3','s5',0),('pl3','s8',1),('pl3','s11',2),('pl3','s14',3),('pl3','s17',4),
  ('pl4','s7',0),('pl4','s10',1),('pl4','s13',2),('pl4','s16',3),('pl4','s19',4),
  ('pl5','s9',0),('pl5','s12',1),('pl5','s15',2),('pl5','s18',3),
  ('pl6','s11',0),('pl6','s14',1),('pl6','s17',2),('pl6','s20',3),
  ('pl7','s13',0),('pl7','s16',1),('pl7','s19',2),
  ('pl8','s15',0),('pl8','s18',1),
  ('pl9','s17',0),('pl9','s20',1),
  ('pl10','s19',0)
ON CONFLICT (playlist_id, song_id) DO NOTHING;

-- Featured content (single row)
INSERT INTO featured_content (id, songs, albums, artists, trending) VALUES
  (1,
    ARRAY['s1','s2','s3','s4'],
    ARRAY['al1','al2','al3','al4'],
    ARRAY['a1','a2','a3','a4'],
    ARRAY['s5','s6','s7','s8','s9','s10']
  )
ON CONFLICT (id) DO NOTHING;
