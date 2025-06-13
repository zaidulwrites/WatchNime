import React, { useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { fetchAnimeById } from '../services/api';
import { Anime } from '../services/api';
import AdScript from '../components/Ads/AdScript';

const AnimeDetailPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext not found");

  const {
    setCurrentPage,
    selectedAnimeId,
    findAnime,
    setAnimeData,
    setSelectedSeasonId
  } = context;

  const anime = findAnime(selectedAnimeId!);

  useEffect(() => {
    if (selectedAnimeId) {
      fetchAnimeById(selectedAnimeId)
        .then(res => {
          setAnimeData((prev: Anime[]) =>
            prev.map((a: Anime) => a.id === selectedAnimeId ? res : a)
          );
        })
        .catch(err => console.error('Error fetching single anime:', err));
    }
  }, [selectedAnimeId, setAnimeData]);

  if (!anime) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <p className="text-xl text-red-500">Anime not found. Please go back to homepage.</p>
        <button
          onClick={() => setCurrentPage('homepage')}
          className="ml-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-8">
      {/* Banner */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-b-lg shadow-xl">
        <img
          src={anime.poster || "https://placehold.co/1200x300/4A5568/CBD5E0?text=No+Banner"}
          alt={`${anime.title} Banner`}
          className="w-full h-full object-cover object-center"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://placehold.co/1200x300/4A5568/CBD5E0?text=No+Banner";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90"></div>
        <h1 className="absolute bottom-4 left-4 text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
          {anime.title}
        </h1>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:space-x-8">
          <div className="flex-grow">
            <h2 className="text-3xl font-bold mb-3 text-orange-400">{anime.title}</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">{anime.description}</p>

            {/* All Details and Genres (no border box) */}
            <div className="text-gray-200 mb-6 leading-relaxed space-y-1">
              <h3 className="text-xl font-semibold mb-2 text-orange-300">Details</h3>
              <pre className="whitespace-pre-wrap font-sans">{anime.allDetails || 'No additional details available.'}</pre>
              <p className="mt-2">
                <span className="font-semibold">Genres:</span>{' '}
                {anime.genres.map(g => g.name).join(', ') || 'N/A'}
              </p>
            </div>

            {/* Ad */}
            <AdScript />

            {/* Seasons */}
            <h3 className="text-2xl font-bold mb-4 mt-6 text-orange-400">Seasons</h3>
            {anime.seasons && anime.seasons.length > 0 ? (
              <div className="space-y-4">
                {anime.seasons.map((season) => (
                  <div
                    key={season.id}
                    className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => {
                      setSelectedSeasonId(season.id);
                      setCurrentPage('seasonDetail');
                    }}
                  >
                    <img
                      src={anime.poster || "https://placehold.co/80x112/4A5568/CBD5E0?text=Season+Img"}
                      alt={`${season.title} Poster`}
                      className="w-20 h-28 object-cover rounded-md flex-shrink-0"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://placehold.co/80x112/4A5568/CBD5E0?text=Season+Img";
                      }}
                    />
                    <h4 className="text-xl font-semibold text-white">{season.title}</h4>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No seasons available for this anime.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetailPage;
