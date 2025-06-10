// user-frontend/src/App.tsx

import React, { useState, createContext, useEffect, useCallback } from 'react';

// Import reusable components
import Header from './components/Header';

// Import the router component
import AppRouter from './routes/AppRouter';

// Import types from services
import { Anime } from './services/api';
import * as api from './services/api';

// --- Context for Global State ---
interface AppContextType {
  currentPage: string; // Can be 'homepage', 'animeDetail', 'seasonDetail', 'contactUs', 'requestAnime', 'joinUs', 'license'
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  selectedAnimeId: string | null;
  setSelectedAnimeId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSeasonId: string | null;
  setSelectedSeasonId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedEpisodeId: string | null;
  setSelectedEpisodeId: React.Dispatch<React.SetStateAction<string | null>>;
  animeData: Anime[];
  setAnimeData: React.Dispatch<React.SetStateAction<Anime[]>>;
  genres: string[];
  setGenres: React.Dispatch<React.SetStateAction<string[]>>;
  loading: boolean;
  error: string | null;
  searchTerm: string; // Search term state for filtering anime
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>; // Setter for search term
  findAnime: (id: string) => Anime | undefined;
  findSeason: (animeId: string, seasonId: string) => api.Season | undefined;
  findEpisode: (animeId: string, seasonId: string, episodeId: string) => api.Episode | undefined;
  fetchInitialData: (searchTerm?: string) => Promise<void>; // fetchInitialData can take a search term
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<string>('homepage');
  const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);

  const [animeData, setAnimeData] = useState<Anime[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Initialize search term state

  // Callback to fetch initial data, can accept an optional search term
  const fetchInitialData = useCallback(async (currentSearchTerm?: string) => {
    setLoading(true);
    setError(null);
    try {
      // Pass the search term to fetchAnime API call
      const [animeRes, genresRes] = await Promise.all([
        api.fetchAnime(currentSearchTerm),
        api.fetchGenres()
      ]);
      setAnimeData(animeRes);
      setGenres(genresRes.map(g => g.name));
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Re-fetch initial data whenever searchTerm changes
    fetchInitialData(searchTerm);
  }, [fetchInitialData, searchTerm]); // Add searchTerm as a dependency

  // Helper function to find anime by ID from the fetched data
  const findAnime = (id: string) => animeData.find(a => a.id === id);
  // Helper function to find a season within an anime by their IDs
  const findSeason = (animeId: string, seasonId: string) => {
    const anime = findAnime(animeId);
    return anime && anime.seasons ? anime.seasons.find(s => s.id === seasonId) : undefined;
  };
  // Helper function to find an episode within a season by their IDs
  const findEpisode = (animeId: string, seasonId: string, episodeId: string) => {
    const season = findSeason(animeId, seasonId);
    return season && season.episodes ? season.episodes.find(e => e.id === episodeId) : undefined;
  };

  // Context value to be provided to consuming components
  const contextValue: AppContextType = {
    currentPage, setCurrentPage,
    selectedAnimeId, setSelectedAnimeId,
    selectedSeasonId, setSelectedSeasonId,
    selectedEpisodeId, setSelectedEpisodeId,
    animeData, setAnimeData,
    genres, setGenres,
    loading, error,
    searchTerm, setSearchTerm, // Include search state in context
    findAnime, findSeason, findEpisode,
    fetchInitialData
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="font-inter antialiased min-h-screen flex flex-col bg-gray-900">
        <Header />
        <main className="flex-grow">
          <AppRouter />
        </main>
      </div>
    </AppProvider>
  );
};

export default App;
