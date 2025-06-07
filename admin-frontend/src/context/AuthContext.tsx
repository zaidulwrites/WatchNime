// admin-frontend/src/context/AuthContext.tsx

import React, { useState, createContext, useEffect, useCallback, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as adminApi from '../services/adminApi'; // Correct path to services

// Define the shape of the user object stored in context
interface UserInfo {
  id: string;
  username: string;
  role: string;
  token: string;
}

// Define the shape of the context value
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  // currentPage, selectedAnimeId, etc. are now better handled by React Router's state and params
  // Keeping them here for now as they were in your original code, but consider refactoring
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  selectedAnimeId: string | null;
  setSelectedAnimeId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSeasonId: string | null;
  setSelectedSeasonId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedEpisodeId: string | null;
  setSelectedEpisodeId: React.Dispatch<React.SetStateAction<string | null>>;
  genres: string[];
  setGenres: React.Dispatch<React.SetStateAction<string[]>>;
  fetchInitialData: () => Promise<void>;
  findAnime: (id: string) => adminApi.Anime | undefined;
  findSeason: (animeId: string, seasonId: string) => adminApi.Season | undefined;
  findEpisode: (animeId: string, seasonId: string, episodeId: string) => adminApi.Episode | undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null); // State to hold user info
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<string>('login'); // This might be better handled by router
  const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [animeData, setAnimeData] = useState<adminApi.Anime[]>([]);

  // Memoize fetchInitialData to avoid unnecessary re-creations
  const fetchInitialData = useCallback(async () => {
    try {
      // Ensure backend is running and accessible from frontend
      const allGenres = await adminApi.fetchAllGenresAdmin();
      setGenres(allGenres.map(g => g.name));

      const allAnime = await adminApi.fetchAllAnimeAdmin();
      setAnimeData(allAnime);
    } catch (err) {
      console.error("Failed to fetch initial admin data:", err);
      // You might want to handle this error more gracefully in UI
    }
  }, []); // Empty dependency array as this function doesn't depend on external state

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          // Check if token is expired
          if (decodedToken.exp * 1000 > Date.now()) {
            setIsAuthenticated(true);
            // Re-hydrate user info from token (assuming id, username, role are in token payload)
            setUser({
              id: decodedToken.id, // Assuming 'id' is in token payload
              username: decodedToken.username, // Assuming 'username' is in token payload
              role: decodedToken.role,     // Assuming 'role' is in token payload
              token: token
            });
            // Consider if setCurrentPage is needed here, router will handle actual page
            // setCurrentPage('dashboard');
            await fetchInitialData(); // Fetch initial data after successful authentication
          } else {
            // Token expired
            localStorage.removeItem('adminToken');
            setIsAuthenticated(false);
            setUser(null);
            // setCurrentPage('login');
          }
        } catch (error) {
          // Invalid token format or other decode error
          console.error("Invalid token:", error);
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
          setUser(null);
          // setCurrentPage('login');
        }
      } else {
        // No token found
        setIsAuthenticated(false);
        setUser(null);
        // setCurrentPage('login');
      }
      setLoading(false); // Authentication check is complete
    };

    checkAuth();
  }, [fetchInitialData]); // fetchInitialData is a dependency because it's called inside checkAuth

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      // Assuming adminApi.loginAdmin returns { id, username, role, token }
      const res = await adminApi.loginAdmin({ username, password });
      localStorage.setItem('adminToken', res.token);
      setIsAuthenticated(true);
      // Store user info from login response
      setUser({
        id: res.id,
        username: res.username,
        role: res.role,
        token: res.token
      });
      // setCurrentPage('dashboard'); // Router will handle navigation
      await fetchInitialData(); // Fetch initial data after login
    } catch (error: any) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw new Error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('login'); // Reset currentPage (though router takes precedence)
    setSelectedAnimeId(null);
    setSelectedSeasonId(null);
    setSelectedEpisodeId(null);
    setGenres([]);
    setAnimeData([]);
  };

  // Helper functions to find data in context
  const findAnime = useCallback((id: string) => animeData.find(a => a.id === id), [animeData]);
  const findSeason = useCallback((animeId: string, seasonId: string) => {
    const anime = findAnime(animeId);
    return anime && anime.seasons ? anime.seasons.find(s => s.id === seasonId) : undefined;
  }, [findAnime]);
  const findEpisode = useCallback((animeId: string, seasonId: string, episodeId: string) => {
    const season = findSeason(animeId, seasonId);
    return season && season.episodes ? season.episodes.find(e => e.id === episodeId) : undefined;
  }, [findSeason]);

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    currentPage,
    setCurrentPage,
    selectedAnimeId,
    setSelectedAnimeId,
    selectedSeasonId,
    setSelectedSeasonId,
    selectedEpisodeId,
    setSelectedEpisodeId,
    genres,
    setGenres,
    fetchInitialData,
    findAnime,
    findSeason,
    findEpisode
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier access to AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
