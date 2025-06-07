import React from 'react';

interface GenreFilterProps {
  genres: string[];
  onSelectGenre: (genre: string) => void;
  selectedGenre: string;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ genres, onSelectGenre, selectedGenre }) => {
  const handleClick = (genre: string) => {
    onSelectGenre(genre);
  };

  return (
    <div className="flex overflow-x-auto space-x-2 bg-gray-800 px-3 py-2 rounded-md scrollbar-hide">
      <button
        onClick={() => handleClick('All')}
        className={`px-3 py-[3px] text-xs font-medium rounded-full whitespace-nowrap ${
          selectedGenre === 'All'
            ? 'bg-orange-500 text-white shadow'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => handleClick(genre)}
          className={`px-3 py-[3px] text-xs font-medium rounded-full whitespace-nowrap ${
            selectedGenre === genre
              ? 'bg-orange-500 text-white shadow'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
