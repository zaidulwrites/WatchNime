// user-frontend/src/pages/AnimeDetailPage.tsx
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { fetchAnimeById } from '../services/api'; // Import API function

const AnimeDetailPage: React.FC = () => {
  const {
    setCurrentPage, selectedAnimeId, findAnime, setAnimeData, setSelectedSeasonId
  } = useContext(AppContext);

  const anime = findAnime(selectedAnimeId!); // Get anime data from global state

  useEffect(() => {
    if (selectedAnimeId) {
      fetchAnimeById(selectedAnimeId)
        .then(res => {
          setAnimeData(prev => prev.map(a => a.id === selectedAnimeId ? res : a));
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
      {/* Main Banner Image - use anime.poster directly */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-b-lg shadow-xl">
        <img
          src={anime.poster || `https://placehold.co/1200x300/4A5568/CBD5E0?text=No+Banner`}
          alt={`${anime.title} Banner`}
          className="w-full h-full object-cover object-center"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://placehold.co/1200x300/4A5568/CBD5E0?text=No+Banner`;
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

            <div className="bg-gray-800 p-6 rounded-lg shadow-inner mb-6">
              <h3 className="text-xl font-semibold mb-3 text-orange-300">Details</h3>
              {/* Ensure anime.allDetails is properly formatted or handled */}
              <pre className="text-gray-200 whitespace-pre-wrap font-sans">
                {anime.allDetails || 'No additional details available.'}
              </pre>
              <p className="mt-2 text-gray-200">
                <span className="font-semibold">Genres:</span> {anime.genres.map(g => g.name).join(', ') || 'N/A'}
              </p>
              {/* Additional details like Release, Type, etc., if they exist in allDetails string or are fetched separately */}
              {/* Example of parsing from allDetails, if it's a JSON string: */}
              {/* {anime.allDetails && (() => {
                  try {
                      const details = JSON.parse(anime.allDetails);
                      return (
                          <>
                              {details.release && <p className="text-gray-200"><span className="font-semibold">Release:</span> {details.release}</p>}
                              {details.type && <p className="text-gray-200"><span className="font-semibold">Type:</span> {details.type}</p>}
                              {details.quality && <p className="text-gray-200"><span className="font-semibold">Quality:</span> {details.quality}</p>}
                          </>
                      );
                  } catch (e) {
                      return null; // Not a JSON string
                  }
              })()} */}
            </div>

            <h3 className="text-2xl font-bold mb-4 text-orange-400">Seasons</h3>
            {anime.seasons && anime.seasons.length > 0 ? (
              <div className="space-y-4">
                {anime.seasons.map((season) => (
                  <div
                    key={season.id}
                    className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => {
                      setSelectedSeasonId(season.id);
                      setCurrentPage('seasonDetail'); // This will trigger AppRouter to render SeasonDetailPage
                    }}
                  >
                    {/* Season Image - use anime.poster or generic placeholder */}
                    <img
                      src={anime.poster || `https://placehold.co/80x112/4A5568/CBD5E0?text=Season+Img`}
                      alt={`${season.title} Poster`}
                      className="w-20 h-28 object-cover rounded-md flex-shrink-0"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://placehold.co/80x112/4A5568/CBD5E0?text=Season+Img`;
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
