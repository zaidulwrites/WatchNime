// user-frontend/src/pages/HomePage.tsx
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App.tsx'; // Ensure .tsx extension
import GenreFilter from '../components/GenreFilter.tsx'; // Ensure .tsx extension
import AnimeGrid from '../components/AnimeGrid.tsx'; // Ensure .tsx extension
import { Anime } from '../services/api'; // Import Anime type

const HomePage: React.FC = () => {
  // Destructure searchTerm from AppContext
  const { animeData, genres, loading, error, searchTerm } = useContext(AppContext);
  const [filteredAnime, setFilteredAnime] = useState<Anime[]>([]);
  const [currentGenreFilter, setCurrentGenreFilter] = useState<string>('All');

  useEffect(() => {
    if (animeData) {
      let tempAnime = animeData;

      // NEW: Filter by search term first if it exists
      if (searchTerm) {
        tempAnime = tempAnime.filter(anime =>
          anime.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Then, filter by genre
      if (currentGenreFilter === 'All') {
        setFilteredAnime(tempAnime);
      } else {
        setFilteredAnime(tempAnime.filter(anime =>
          anime.genres.some(genre => genre.name === currentGenreFilter)
        ));
      }
    }
  }, [animeData, currentGenreFilter, searchTerm]); // Add searchTerm to dependencies

  const handleGenreSelect = (genre: string) => {
    setCurrentGenreFilter(genre);
  };

  // Loading and error states are already handled by AppRouter now,
  // but keeping them here as a fallback or for more granular control.
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-xl">
        Loading anime...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center text-xl p-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="mb-6">
        <GenreFilter genres={genres} onSelectGenre={handleGenreSelect} selectedGenre={currentGenreFilter} /> {/* Added selectedGenre prop */}
      </div>

      {filteredAnime.length > 0 ? (
        <AnimeGrid animeList={filteredAnime} />
      ) : (
        <div className="text-center text-gray-400 text-xl mt-8">
          {searchTerm ? `No anime found for "${searchTerm}". Try a different search.` : "No anime available matching your criteria."}
        </div>
      )}
    </div>
  );
};

export default HomePage;
