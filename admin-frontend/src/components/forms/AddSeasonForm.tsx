// admin-frontend/src/components/forms/AddSeasonForm.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as adminApi from '../../services/adminApi';

interface AddSeasonFormData {
  title: string;
  // No poster for season
}

interface AddSeasonFormProps {
  animeId?: string; // Optional for edit mode, required for add mode
  seasonId?: string; // Optional for add mode, required for edit mode
}

const AddSeasonForm: React.FC<AddSeasonFormProps> = ({ animeId, seasonId }) => {
  const navigate = useNavigate();
  // fetchInitialData is sufficient here, no need for findSeason or findAnime
  const { fetchInitialData } = useAuth(); 

  const [formData, setFormData] = useState<AddSeasonFormData>({
    title: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (seasonId) { // If seasonId exists, it's edit mode
      setIsEditMode(true);
      const loadSeason = async () => {
        setLoading(true);
        try {
          // Fetch all anime and then find the season to get its details
          const allAnime = await adminApi.fetchAllAnimeAdmin();
          let foundSeason: adminApi.Season | undefined;
          for (const anime of allAnime) {
            foundSeason = anime.seasons.find(s => s.id === seasonId);
            if (foundSeason) {
              setFormData({
                title: foundSeason.title,
              });
              break;
            }
          }
          if (!foundSeason) setError("Season not found for editing.");
        } catch (err) {
          console.error("Failed to fetch season for editing:", err);
          setError("Failed to load season details.");
        } finally {
          setLoading(false);
        }
      };
      loadSeason();
    }
  }, [seasonId]); // Depend on seasonId

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && seasonId) {
        await adminApi.updateSeasonAdmin(seasonId, formData);
        alert('Season updated successfully!');
      } else if (animeId) {
        await adminApi.addSeasonAdmin(animeId, formData); // formData now only contains title
        alert('Season added successfully!');
        setFormData({ title: '' }); // Clear form
      } else {
        throw new Error("Anime ID is missing for adding a season.");
      }
      await fetchInitialData(); // Refresh data in context

      // After operation, navigate back to the anime detail page
      // To get animeId from seasonId, we need to fetch all anime again
      // or rely on an initial fetch if seasonId is present (edit mode)
      let targetAnimeId = animeId;
      if (!targetAnimeId && seasonId) {
          const allAnime = await adminApi.fetchAllAnimeAdmin();
          for (const anime of allAnime) {
              const foundSeason = anime.seasons.find(s => s.id === seasonId);
              if (foundSeason) {
                  targetAnimeId = foundSeason.animeId;
                  break;
              }
          }
      }

      if (targetAnimeId) {
        navigate(`/anime/${targetAnimeId}`);
      } else {
        navigate('/dashboard'); // A safe fallback
      }
    } catch (err: any) {
      console.error('Error submitting season:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center text-white">Loading season details...</div>;
  }

  if (!isEditMode && !animeId) {
    return (
      <div className="text-center text-red-500 my-8">
        Anime ID is required to add a season. Please select the correct anime from the dashboard.
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        {isEditMode ? 'Edit Season' : `Add New Season to Anime ID: ${animeId}`}
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Removed Poster URL for season */}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-md transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Submitting...' : (isEditMode ? 'Update Season' : 'Add Season')}
          </button>
          <button
            type="button"
            onClick={async () => {
              let targetAnimeId = animeId;
              if (!targetAnimeId && seasonId) {
                  // In edit mode, if animeId is not passed, try to derive it from the seasonId
                  const allAnime = await adminApi.fetchAllAnimeAdmin();
                  for (const animeItem of allAnime) {
                      const foundSeason = animeItem.seasons.find(s => s.id === seasonId);
                      if (foundSeason) {
                          targetAnimeId = foundSeason.animeId;
                          break;
                      }
                  }
              }
              if (targetAnimeId) {
                navigate(`/anime/${targetAnimeId}`);
              } else {
                navigate('/dashboard');
              }
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-md transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSeasonForm;
