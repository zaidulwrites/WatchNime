// admin-frontend/src/components/forms/AddAnimeForm.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx'; // Correct path to AuthContext.tsx
import * as adminApi from '../../services/adminApi'; // Correct path to adminApi

// Interface for form data (only one poster)
interface AddAnimeFormData {
  title: string;
  description: string;
  poster: string; // Only one poster URL
  allDetails: string;
  // genreNames will be handled separately in the API call
}

const AddEditAnime = () => {
  const { id } = useParams<{ id: string }>(); // For edit mode
  const navigate = useNavigate();
  // We need genres from AuthContext because AddAnimeForm needs to show existing genres to select from
  const { fetchInitialData, genres, findAnime, setGenres } = useAuth(); // Get necessary context values

  const [formData, setFormData] = useState<AddAnimeFormData>({
    title: '',
    description: '',
    poster: '',
    allDetails: '',
  });
  const [selectedGenreNames, setSelectedGenreNames] = useState<string[]>([]); // To manage selected genres
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newGenreName, setNewGenreName] = useState(''); // State for new genre
  const [genreError, setGenreError] = useState<string | null>(null); // Error state for adding genre

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const existingAnime = findAnime(id);
      if (existingAnime) {
        setFormData({
          title: existingAnime.title,
          description: existingAnime.description || '',
          poster: existingAnime.poster || '',
          allDetails: existingAnime.allDetails || '',
        });
        setSelectedGenreNames(existingAnime.genres ? existingAnime.genres.map(g => g.name) : []);
      } else {
        const loadAnime = async () => {
          setLoading(true);
          try {
            const fetchedAnime = await adminApi.fetchAnimeByIdAdmin(id);
            setFormData({
              title: fetchedAnime.title,
              description: fetchedAnime.description || '',
              poster: fetchedAnime.poster || '',
              allDetails: fetchedAnime.allDetails || '',
            });
            setSelectedGenreNames(fetchedAnime.genres ? fetchedAnime.genres.map(g => g.name) : []);
          } catch (err) {
            console.error("Failed to fetch anime for editing:", err);
            setError("Failed to load anime details.");
          } finally {
            setLoading(false);
          }
        };
        loadAnime();
      }
    }
  }, [id, findAnime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleGenreSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.options);
    const selected = options.filter(option => option.selected).map(option => option.value);
    setSelectedGenreNames(selected);
  };

  const handleAddGenre = async () => {
    if (!newGenreName.trim()) {
      setGenreError('Genre name cannot be empty.');
      return;
    }
    setGenreError(null);
    try {
      const addedGenre = await adminApi.addGenreAdmin(newGenreName.trim());
      // Update genre list in context (so other components can use it)
      setGenres((prevGenres) => [...prevGenres, addedGenre.name]);
      // Also add the new genre to selected genres for this anime
      setSelectedGenreNames((prevSelected) => [...prevSelected, addedGenre.name]);
      setNewGenreName(''); // Clear input field
      alert('Genre added successfully!'); // Use custom modal in production
    } catch (err: any) {
      console.error('Error adding genre:', err);
      setGenreError(err.response?.data?.message || 'Failed to add genre.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && id) {
        // Pass formData and selectedGenreNames separately as per backend controller
        await adminApi.updateAnimeAdmin(id, formData, selectedGenreNames);
        alert('Anime updated successfully!'); // Use custom modal in production
      } else {
        // Pass formData and selectedGenreNames separately
        await adminApi.addAnimeAdmin(formData, selectedGenreNames);
        alert('Anime added successfully!'); // Use custom modal in production
        setFormData({ // Clear form after adding
          title: '', description: '', poster: '', allDetails: ''
        });
        setSelectedGenreNames([]); // Clear selected genres too
      }
      await fetchInitialData(); // Refresh data in context
      navigate('/dashboard'); // Navigate back to dashboard
    } catch (err: any) {
      console.error('Error submitting anime:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center text-white">Loading anime details...</div>;
  }

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        {isEditMode ? 'Edit Anime' : 'Add New Anime'}
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

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Poster URL (Only one poster) */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="poster">
            Poster URL
          </label>
          <input
            type="text"
            id="poster"
            name="poster"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            value={formData.poster}
            onChange={handleChange}
          />
        </div>

        {/* All Details */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="allDetails">
            All Details (JSON string or URL)
          </label>
          <textarea
            id="allDetails"
            name="allDetails"
            rows={4}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            value={formData.allDetails}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Genres (Add New and Multi-select Existing) */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="newGenreName">
            Add New Genre
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              id="newGenreName"
              name="newGenreName"
              placeholder="New genre name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              value={newGenreName}
              onChange={(e) => setNewGenreName(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddGenre}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm"
              disabled={!newGenreName.trim()}
            >
              Add
            </button>
          </div>
          {genreError && <p className="text-red-500 text-xs mb-2">{genreError}</p>}

          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="genreNames">
            Select Existing Genres (multiple)
          </label>
          <select
            id="genreNames"
            name="genreNames"
            multiple
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white h-32"
            value={selectedGenreNames} // Use selectedGenreNames here
            onChange={handleGenreSelectChange} // Use new handler
          >
            {genres.map((genreName) => (
              <option key={genreName} value={genreName}>
                {genreName}
              </option>
            ))}
          </select>
          <p className="text-gray-400 text-xs mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-md transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Submitting...' : (isEditMode ? 'Update Anime' : 'Add Anime')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-md transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditAnime;
