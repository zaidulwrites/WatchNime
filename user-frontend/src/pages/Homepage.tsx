// user-frontend/src/pages/HomePage.tsx
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App'; // ❌ remove `.tsx` extension
import GenreFilter from '../components/GenreFilter';
import AnimeGrid from '../components/AnimeGrid';
import { Anime } from '../services/api';

const HomePage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    return <div className="text-red-500">App context not available.</div>;
  }

  const { animeData, genres, loading, error, searchTerm } = context;
  const [filteredAnime, setFilteredAnime] = useState<Anime[]>([]);
  const [currentGenreFilter, setCurrentGenreFilter] = useState<string>('All');

  useEffect(() => {
    if (animeData) {
      let tempAnime = animeData;

      // Filter by search term first
      if (searchTerm) {
        tempAnime = tempAnime.filter((anime: Anime) =>
          anime.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by genre
      if (currentGenreFilter === 'All') {
        setFilteredAnime(tempAnime);
      } else {
        setFilteredAnime(
          tempAnime.filter((anime: Anime) =>
            anime.genres.some((genre) => genre.name === currentGenreFilter)
          )
        );
      }
    }
  }, [animeData, currentGenreFilter, searchTerm]);

  const handleGenreSelect = (genre: string) => {
    setCurrentGenreFilter(genre);
  };

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
        <GenreFilter
          genres={genres}
          onSelectGenre={handleGenreSelect}
          selectedGenre={currentGenreFilter}
        />
      </div>

      {filteredAnime.length > 0 ? (
        <AnimeGrid animeList={filteredAnime} />
      ) : (
        <div className="text-center text-gray-400 text-xl mt-8">
          {searchTerm
            ? `No anime found for "${searchTerm}". Try a different search.`
            : 'No anime available matching your criteria.'}
        </div>
      )}
    </div>
  );
};

export default HomePage;
