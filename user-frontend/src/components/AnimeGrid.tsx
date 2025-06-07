import React from 'react';
import AnimeCard from './AnimeCard';
import { Anime } from '../services/api';

interface AnimeGridProps {
  animeList: Anime[];
}

const AnimeGrid: React.FC<AnimeGridProps> = ({ animeList }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 justify-center">
      {animeList.length > 0 ? (
        animeList.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))
      ) : (
        <p className="text-center text-gray-400 col-span-full text-xl mt-8">
          No anime found matching the criteria.
        </p>
      )}
    </div>
  );
};

export default AnimeGrid;
