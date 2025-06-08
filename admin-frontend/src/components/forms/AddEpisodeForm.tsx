// admin-frontend/src/components/forms/AddEpisodeForm.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as adminApi from '../../services/adminApi';

interface AddEpisodeFormData {
  title: string;
  link480p: string;
  link720p: string;
  link1080p: string;
}

interface AddEpisodeFormProps {
  seasonId?: string;
  episodeId?: string;
}

const AddEpisodeForm: React.FC<AddEpisodeFormProps> = ({ seasonId, episodeId }) => {
  const navigate = useNavigate();
  const { fetchInitialData, findEpisode, findSeason, findAnime } = useAuth();

  const [formData, setFormData] = useState<AddEpisodeFormData>({
    title: '',
    link480p: '',
    link720p: '',
    link1080p: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (episodeId) {
      setIsEditMode(true);
      if (seasonId) {
        const loadEpisode = async () => {
          setLoading(true);
          try {
            const allAnime = await adminApi.fetchAllAnimeAdmin();
            let foundEpisode: adminApi.Episode | undefined;
            for (const anime of allAnime) {
              const season = anime.seasons.find(s => s.id === seasonId);
              if (season) {
                foundEpisode = season.episodes.find(e => e.id === episodeId);
                if (foundEpisode) break;
              }
            }

            if (foundEpisode) {
              setFormData({
                title: foundEpisode.title,
                link480p: foundEpisode.link480p || '',
                link720p: foundEpisode.link720p || '',
                link1080p: foundEpisode.link1080p || '',
              });
            } else {
              setError("Episode not found for editing.");
            }
          } catch (err) {
            console.error("Failed to fetch episode for editing:", err);
            setError("Failed to load episode details.");
          } finally {
            setLoading(false);
          }
        };
        loadEpisode();
      } else {
        setError("Season ID is missing for episode editing.");
      }
    }
  }, [episodeId, seasonId, findEpisode, findSeason, findAnime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && episodeId) {
        await adminApi.updateEpisodeAdmin(episodeId, formData);
        alert('Episode updated successfully!');
      } else if (seasonId) {
        await adminApi.addEpisodeAdmin(seasonId, formData);
        alert('Episode added successfully!');
        setFormData({ title: '', link480p: '', link720p: '', link1080p: '' });
      } else {
        throw new Error("Season ID is missing for adding an episode.");
      }
      await fetchInitialData();

      const season = findSeason(findAnime(findEpisode(null, seasonId, episodeId)?.seasonId || '')?.id || '', seasonId);
      if (season && season.animeId) {
        navigate(`/anime/${season.animeId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Error submitting episode:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center text-white">Loading episode details...</div>;
  }

  if (!isEditMode && !seasonId) {
    return (
      <div className="text-center text-red-500 my-8">
        Season ID is required to add an episode. Please select the correct season from the anime details page.
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        {isEditMode ? 'Edit Episode' : `Add New Episode to Season ID: ${seasonId}`}
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

        {/* 480p Link */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="link480p">
            480p Link
          </label>
          <input
            type="text"
            id="link480p"
            name="link480p"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            value={formData.link480p}
            onChange={handleChange}
          />
        </div>

        {/* 720p Link */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="link720p">
            720p Link
          </label>
          <input
            type="text"
            id="link720p"
            name="link720p"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            value={formData.link720p}
            onChange={handleChange}
          />
        </div>

        {/* 1080p Link */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="link1080p">
            1080p Link
          </label>
          <input
            type="text"
            id="link1080p"
            name="link1080p"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            value={formData.link1080p}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-md transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Submitting...' : (isEditMode ? 'Update Episode' : 'Add Episode')}
          </button>
          <button
            type="button"
            onClick={() => {
              const season = findSeason(findAnime(findEpisode(null, seasonId, episodeId)?.seasonId || '')?.id || '', seasonId);
              if (season && season.animeId) {
                navigate(`/anime/${season.animeId}`);
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

export default AddEpisodeForm;
