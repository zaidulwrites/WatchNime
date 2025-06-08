// admin-frontend/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AddEditAnime from './pages/AddEditAnime';
import AddEditSeason from './pages/AddEditSeason'; // Import AddEditSeason
import AddEditEpisode from './pages/AddEditEpisode'; // Import AddEditEpisode
import AdminAnimeDetail from './pages/AdminAnimeDetail';
// If AdminAnimeManagementPage and Genres are removed from dashboard,
// you might want to remove these imports or keep them if they are still routed elsewhere.
// For now, let's keep them as routes are defined for them.
import AdminAnimeManagementPage from './pages/AdminAnimeManagementPage';

import { useAuth } from './context/AuthContext';

import './styles/admin.css';
import './index.css';

const App: React.FC = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-2xl">
        Loading application...
      </div>
    );
  }

  return (
    <Router>
      <div className="font-inter antialiased min-h-screen flex flex-col bg-gray-900 text-white">
        <Header />
        <main className="container mx-auto p-4 flex-grow">
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/dashboard"
              element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/anime/add"
              element={isAuthenticated ? <AddEditAnime /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/anime/edit/:id"
              element={isAuthenticated ? <AddEditAnime /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/anime/:id"
              element={isAuthenticated ? <AdminAnimeDetail /> : <Navigate to="/login" replace />}
            />
            {/* ROUTES FOR SEASON AND EPISODE */}
            <Route
              path="/anime/:animeId/season/add" // This route takes animeId to AddEditSeason
              element={isAuthenticated ? <AddEditSeason /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/season/edit/:id" // This route takes season ID for editing AddEditSeason
              element={isAuthenticated ? <AddEditSeason /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/season/:seasonId/episode/add" // This route takes seasonId to AddEditEpisode
              element={isAuthenticated ? <AddEditEpisode /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/episode/edit/:id" // This route takes episode ID for editing AddEditEpisode
              element={isAuthenticated ? <AddEditEpisode /> : <Navigate to="/login" replace />}
            />

            {/* Existing routes for Genre Management and AdminAnimeManagementPage, if still relevant */}
            {/* If you fully removed Genre Management from dashboard, you might remove the /genres route completely */}
            <Route
              path="/genres"
              element={isAuthenticated ? <div>Genre Management Page (TODO)</div> : <Navigate to="/login" replace />}
            />
            {/* If you're not using /manage-anime route anymore, you can remove it */}
            <Route
              path="/manage-anime"
              element={isAuthenticated ? <AdminAnimeManagementPage /> : <Navigate to="/login" replace />}
            />


            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
            />

            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
