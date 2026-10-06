import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { MusicPlayerProvider } from './context/MusicPlayerContext.jsx';
import { seedData } from './utils/seedData.js';
import { useEffect } from 'react';

import UserLayout from './components/UserLayout.jsx';
import AdminLayout from './admin/AdminLayout.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Discover from './pages/Discover.jsx';
import Library from './pages/Library.jsx';
import Playlists from './pages/Playlists.jsx';
import Playlist from './pages/Playlist.jsx';
import Album from './pages/Album.jsx';
import Artist from './pages/Artist.jsx';
import LikedSongs from './pages/LikedSongs.jsx';
import Downloads from './pages/Downloads.jsx';
import FollowedArtists from './pages/FollowedArtists.jsx';
import Profile from './pages/Profile.jsx';
import SettingsPage from './pages/Settings.jsx';

import AdminDashboard from './admin/AdminDashboard.jsx';
import ManageUsers from './admin/ManageUsers.jsx';
import ManageSongs from './admin/ManageSongs.jsx';
import ManageAlbums from './admin/ManageAlbums.jsx';
import ManageArtists from './admin/ManageArtists.jsx';
import ManageGenres from './admin/ManageGenres.jsx';
import ManagePlaylists from './admin/ManagePlaylists.jsx';
import FeaturedContent from './admin/FeaturedContent.jsx';
import Reports from './admin/Reports.jsx';
import AdminSettings from './admin/AdminSettings.jsx';

function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#b3b3b3' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/home" />;
  return children;
}

function AppRoutes() {
  useEffect(() => { seedData(); }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/home" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="discover" element={<Discover />} />
        <Route path="library" element={<Library />} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="playlist/:id" element={<Playlist />} />
        <Route path="album/:id" element={<Album />} />
        <Route path="artist/:id" element={<Artist />} />
        <Route path="liked" element={<LikedSongs />} />
        <Route path="downloads" element={<Downloads />} />
        <Route path="followed" element={<FollowedArtists />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="songs" element={<ManageSongs />} />
        <Route path="albums" element={<ManageAlbums />} />
        <Route path="artists" element={<ManageArtists />} />
        <Route path="genres" element={<ManageGenres />} />
        <Route path="playlists" element={<ManagePlaylists />} />
        <Route path="featured" element={<FeaturedContent />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MusicPlayerProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MusicPlayerProvider>
    </AuthProvider>
  );
}
