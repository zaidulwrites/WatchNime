// admin-frontend/src/pages/AdminAnimeManagementPage.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import * as adminApi from '../services/adminApi';

const AdminAnimeManagementPage = () => {
  const { animeData, fetchInitialData, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAnime = async (animeId: string, animeTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${animeTitle}" and all its related seasons/episodes?`)) {
      return;
    }
    try {
      await adminApi.deleteAnimeAdmin(animeId);
      alert(`Anime "${animeTitle}" deleted successfully!`);
      await fetchInitialData();
    } catch (err: any) {
      console.error("Failed to delete anime:", err);
      alert(err.response?.data?.message || "Failed to delete anime.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-2xl">
        Loading Anime List...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500 text-xl">
        Error: {error}
        <button onClick={fetchInitialData} className="ml-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
          Retry Loading Data
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-orange-500">Manage All Anime</h1>

      <div className="flex justify-between items-center mb-6">
        <Link to="/dashboard" className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
          &larr; Back to Dashboard
        </Link>
        <Link to="/anime/add" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
          Add New Anime
        </Link>
      </div>

      {animeData && animeData.length > 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Genres</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {animeData.map((anime) => (
                <tr key={anime.id} className="hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/anime/${anime.id}`} className="text-orange-400 hover:underline">
                      {anime.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {anime.genres.map(g => g.name).join(', ') || 'None'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/anime/edit/${anime.id}`} className="text-indigo-400 hover:text-indigo-600 mr-4">Edit</Link>
                    <button
                      onClick={() => handleDeleteAnime(anime.id, anime.title)}
                      className="text-red-400 hover:text-red-600 bg-transparent py-1 px-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-400 text-xl mt-8">No anime available. Add new anime using the button above.</p>
      )}
    </div>
  );
};

export default AdminAnimeManagementPage;
