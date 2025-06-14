// admin-frontend/src/pages/AdminDashboard.tsx

import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Path to AuthContext.tsx
import * as adminApi from '../services/adminApi'; // Path to adminApi

const AdminDashboard = () => {
  const { isAuthenticated, loading: authLoading } = useAuth(); // Only use auth status from context
  const [animeData, setAnimeData] = useState<adminApi.Anime[]>([]); // Local state for anime
  const [, setGenres] = useState<string[]>([]); // Local state for genres
  const [dashboardLoading, setDashboardLoading] = useState(true); // Loading state for dashboard's own data
  const [dashboardError, setDashboardError] = useState<string | null>(null); // Error state for dashboard's own data
  const [animeIdToOpen, setAnimeIdToOpen] = useState<string>(''); // State for ID input
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setDashboardLoading(true);
      setDashboardError(null);
      try {
        const [fetchedGenres, fetchedAnime] = await Promise.all([
          adminApi.fetchAllGenresAdmin(),
          adminApi.fetchAllAnimeAdmin()
        ]);
        setGenres(fetchedGenres.map((g: { name: string }) => g.name)); // fix type of g
        setAnimeData(fetchedAnime);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setDashboardError(err.message || "Failed to load dashboard data. Please ensure backend is running and accessible.");
      } finally {
        setDashboardLoading(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchDashboardData();
    }
  }, [isAuthenticated, authLoading]);

  const handleOpenAnimeById = () => {
    if (animeIdToOpen.trim()) {
      navigate(`/anime/${animeIdToOpen.trim()}`);
    } else {
      alert("Please enter a valid Anime ID.");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-2xl">
        Loading Application...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-2xl">
        Loading Dashboard Data...
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500 text-xl">
        Error: {dashboardError}
        <button onClick={() => window.location.reload()} className="ml-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-orange-500">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Anime Management</h2>
          <p className="text-gray-400 mb-4">Manage anime titles, descriptions, and details.</p>
          <div className="flex space-x-2 mb-4">
            <Link to="/anime/add" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
              Add New Anime
            </Link>
          </div>
          {animeData.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Existing Anime ({animeData.length})</h3>
              <ul className="list-disc list-inside text-gray-300 max-h-40 overflow-y-auto">
                {animeData.map(anime => (
                  <li key={anime.id} className="mb-1">
                    <Link to={`/anime/${anime.id}`} className="text-orange-400 hover:underline">
                      {anime.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-400">No anime added yet.</p>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Open Anime by ID</h2>
          <p className="text-gray-400 mb-4">Quickly access an anime using its unique ID.</p>
          <div className="flex flex-col space-y-3">
            <input
              type="text"
              placeholder="Enter Anime ID (e.g., e8bc717e-...)"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              value={animeIdToOpen}
              onChange={(e) => setAnimeIdToOpen(e.target.value)}
            />
            <button
              onClick={handleOpenAnimeById}
              className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg"
            >
              Open Anime
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
