// admin-frontend/src/pages/AdminAnimeDetail.tsx

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import * as adminApi from "../services/adminApi";

const AdminAnimeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchInitialData } = useAuth(); // Assuming fetchInitialData is available for refreshing data

  const [anime, setAnime] = useState<adminApi.Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load anime details
  const loadAnimeDetails = useCallback(async () => {
    if (!id) {
      setError("Anime ID is missing.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const fetchedAnime = await adminApi.fetchAnimeByIdAdmin(id);
      setAnime(fetchedAnime);
    } catch (err: any) {
      console.error("Failed to fetch anime details:", err);
      setError(err.response?.data?.message || "Failed to load anime details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAnimeDetails(); // Load details on component mount or ID change
  }, [loadAnimeDetails]);

  // Handle Anime Delete
  const handleDeleteAnime = async () => {
    if (!id || !window.confirm("Are you sure you want to delete this anime and all its seasons/episodes? This action cannot be undone.")) {
      return;
    }
    setLoading(true);
    try {
      await adminApi.deleteAnimeAdmin(id);
      alert("Anime deleted successfully!"); // Replace with custom modal
      await fetchInitialData(); // Refresh data in context after deletion
      navigate("/dashboard"); // Go back to dashboard
    } catch (err: any) {
      console.error("Failed to delete anime:", err);
      setError(err.response?.data?.message || "Failed to delete anime.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Season Delete
  const handleDeleteSeason = async (seasonId: string, seasonTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete season "${seasonTitle}" and all its episodes? This action cannot be undone.`)) {
      return;
    }
    setLoading(true);
    try {
      await adminApi.deleteSeasonAdmin(seasonId);
      alert("Season deleted successfully!"); // Replace with custom modal
      await loadAnimeDetails(); // Reload anime details to update seasons
      await fetchInitialData(); // Refresh data in context
    } catch (err: any) {
      console.error("Failed to delete season:", err);
      setError(err.response?.data?.message || "Failed to delete season.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Episode Delete
  const handleDeleteEpisode = async (episodeId: string, episodeTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete episode "${episodeTitle}"? This action cannot be undone.`)) {
      return;
    }
    setLoading(true);
    try {
      await adminApi.deleteEpisodeAdmin(episodeId);
      alert("Episode deleted successfully!"); // Replace with custom modal
      await loadAnimeDetails(); // Reload anime details to update episodes
      await fetchInitialData(); // Refresh data in context
    } catch (err: any) {
      console.error("Failed to delete episode:", err);
      setError(err.response?.data?.message || "Failed to delete episode.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-2xl">Loading anime details...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500 text-xl">Error: {error}</div>;
  }

  if (!anime) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400 text-xl">Anime not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Admin Controls at the top */}
      <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
        <Link to="/dashboard" className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-orange-500">{anime.title} (Admin View)</h1>
        <div className="flex space-x-2">
          <Link to={`/anime/edit/${anime.id}`} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
            Edit Anime
          </Link>
          <button onClick={handleDeleteAnime} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg">
            Delete Anime
          </button>
        </div>
      </div>

      {/* Main Content Area - mimicking user frontend layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Poster and Basic Info */}
        <div className="md:w-1/3 flex flex-col items-center">
          {anime.poster && (
            <img
              src={anime.poster}
              alt={`${anime.title} Poster`}
              className="w-full rounded-lg shadow-lg mb-6 max-w-xs md:max-w-full"
            />
          )}
          <h2 className="text-3xl font-bold text-orange-400 mb-4 text-center">{anime.title}</h2>
          <p className="text-gray-300 text-center mb-4">{anime.description}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {anime.genres.map((genre) => (
              <span key={genre.id} className="bg-gray-700 text-sm px-3 py-1 rounded-full">
                {genre.name}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Seasons and Episodes */}
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-4">Seasons</h2>
          <Link
            to={`/anime/${anime.id}/season/add`}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg mb-4 inline-block"
          >
            Add New Season
          </Link>

          {anime.seasons && anime.seasons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anime.seasons.map((season) => (
                <div key={season.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-orange-400 mb-2">{season.title}</h3>
                  {/* Removed season.poster rendering - will use anime.poster instead if needed elsewhere */}
                  {/* If you want to show anime's poster here as fallback: */}
                  {/* {anime.poster && (
                    <img
                      src={anime.poster}
                      alt={`${anime.title} Poster`}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )} */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Link to={`/season/edit/${season.id}`} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg text-sm">
                      Edit Season
                    </Link>
                    <button onClick={() => handleDeleteSeason(season.id, season.title)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg text-sm">
                      Delete Season
                    </button>
                    <Link to={`/season/${season.id}/episode/add`} className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded-lg text-sm">
                      Add Episode
                    </Link>
                  </div>

                  <h4 className="text-lg font-semibold mt-4 mb-2 border-b border-gray-600 pb-1">Episodes</h4>
                  {season.episodes && season.episodes.length > 0 ? (
                    <ul className="space-y-2">
                      {season.episodes.map((episode) => (
                        <li key={episode.id} className="bg-gray-700 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <span className="font-medium">{episode.title}</span>
                          <div className="flex flex-wrap space-x-2 mt-2 sm:mt-0">
                            {episode.link480p && <a href={episode.link480p} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline text-xs">480p</a>}
                            {episode.link720p && <a href={episode.link720p} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline text-xs">720p</a>}
                            {episode.link1080p && <a href={episode.link1080p} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline text-xs">1080p</a>}
                            <Link to={`/episode/edit/${episode.id}`} className="bg-blue-400 hover:bg-blue-500 text-white py-1 px-2 rounded-lg text-xs">
                              Edit
                            </Link>
                            <button onClick={() => handleDeleteEpisode(episode.id, episode.title)} className="bg-red-400 hover:bg-red-500 text-white py-1 px-2 rounded-lg text-xs">
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm">No episodes for this season.</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No seasons for this anime. Add one above!</p>
          )}
        </div>
      </div>
      {anime.allDetails && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-6">
          <h3 className="text-xl font-semibold mb-2">Additional Details</h3>
          <p className="text-gray-300">{anime.allDetails}</p>
        </div>
      )}
    </div>
  );
};

export default AdminAnimeDetail;
