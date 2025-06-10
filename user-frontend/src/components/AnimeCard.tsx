import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Anime } from '../services/api';

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const context = useContext(AppContext);
if (!context) throw new Error("AppContext not found");
const { setCurrentPage, setSelectedAnimeId } = context;


  const handleClick = () => {
    setSelectedAnimeId(anime.id);
    setCurrentPage('animeDetail');
  };

  const imageUrl = anime.poster;
  const fallbackPlaceholder = `https://placehold.co/250x350/4A5568/CBD5E0?text=No+Image`;

  return (
    <div
      className="w-[115px] sm:w-[160px] md:w-[200px] lg:w-[250px] h-[180px] sm:h-[250px] md:h-[300px] lg:h-[350px]
                 bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-transform duration-300 hover:scale-105"
      onClick={handleClick}
    >
      <img
        src={imageUrl || fallbackPlaceholder}
        alt={anime.title}
        className="w-full h-[140px] sm:h-[190px] md:h-[240px] lg:h-[300px] object-cover"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fallbackPlaceholder;
        }}
      />
      <div className="h-[40px] sm:h-[60px] bg-gray-900 flex items-center justify-center p-1">
        <h3 className="text-white text-[10px] sm:text-sm font-semibold text-center truncate w-full px-1">
          {anime.title}
        </h3>
      </div>
    </div>
  );
};

export default AnimeCard;
