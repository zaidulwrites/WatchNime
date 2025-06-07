// user-frontend/src/pages/SeasonPage.tsx
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AppContext } from '../App';
import { fetchSeasonById } from '../services/api'; // Import API function
import { Season as SeasonType, Episode as EpisodeType } from '../services/api'; // Import types

const SeasonPage: React.FC = () => {
  const {
    setCurrentPage, selectedAnimeId, selectedSeasonId, findAnime
  } = useContext(AppContext);

  const [season, setSeason] = useState<SeasonType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const anime = selectedAnimeId ? findAnime(selectedAnimeId) : undefined;
  const animePoster = anime?.poster; // Get anime poster for fallback

  // Function to fetch season details
  const loadSeasonDetails = useCallback(async () => {
    if (!selectedSeasonId) {
      setError("Season ID is missing.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fetchedSeason = await fetchSeasonById(selectedSeasonId);
      setSeason(fetchedSeason);
    } catch (err: any) {
      console.error("Error fetching season details:", err);
      setError(err.response?.data?.message || "Failed to load season details.");
    } finally {
      setLoading(false);
    }
  }, [selectedSeasonId]);

  useEffect(() => {
    loadSeasonDetails();
  }, [loadSeasonDetails]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-2xl">
        Loading Season Details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500 text-xl">
        Error: {error}
        <button
          onClick={loadSeasonDetails}
          className="ml-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!season) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400 text-xl">
        Season not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-8">
      <div className="container mx-auto p-4 md:p-8">
        <button
          onClick={() => setCurrentPage('animeDetail')}
          className="mb-6 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
        >
          &larr; Back to Anime
        </button>

        <div className="flex flex-col md:flex-row items-start md:space-x-8">
          <div className="md:w-1/3 flex flex-col items-center">
            {/* Season Image - use animePoster as seasons no longer have their own */}
            <img
              src={animePoster || `https://placehold.co/300x420/4A5568/CBD5E0?text=Season+Poster`}
              alt={`${season.title} Poster`}
              className="w-full rounded-lg shadow-lg mb-6 max-w-xs md:max-w-full"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://placehold.co/300x420/4A5568/CBD5E0?text=Season+Poster`;
              }}
            />
            <h2 className="text-3xl font-bold text-orange-400 mb-4 text-center">{season.title}</h2>
            {/* Any season specific details can go here */}
          </div>

          <div className="md:w-2/3">
            <h3 className="text-2xl font-bold mb-4 text-orange-400">Episodes</h3>
            {season.episodes && season.episodes.length > 0 ? (
              <div className="space-y-4">
                {season.episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => {
                      // You might want to navigate to an EpisodeDetailPage here
                      // For now, let's just log or set state to view episode details.
                      // If you have an EpisodeDetailPage, you'd set selectedEpisodeId and change page.
                      console.log("Clicked episode:", episode.title, "ID:", episode.id);
                      // Example if you have an EpisodeDetailPage:
                      // setSelectedEpisodeId(episode.id);
                      // setCurrentPage('episodeDetail');
                    }}
                  >
                    {/* REMOVED: Episode image */}
                    {/* <img
                      src={animePoster || `https://placehold.co/80x112/4A5568/CBD5E0?text=Episode+Img`}
                      alt={`${episode.title} Thumbnail`}
                      className="w-20 h-28 object-cover rounded-md flex-shrink-0"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://placehold.co/80x112/4A5568/CBD5E0?text=Episode+Img`;
                      }}
                    /> */}
                    <div className="flex-grow">
                      <h4 className="text-xl font-semibold text-white">{episode.title}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {episode.link480p && (
                          <a href={episode.link480p} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                            480p
                          </a>
                        )}
                        {episode.link720p && (
                          <a href={episode.link720p} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                            720p
                          </a>
                        )}
                        {episode.link1080p && (
                          <a href={episode.link1080p} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                            1080p
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No episodes available for this season.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonPage;
