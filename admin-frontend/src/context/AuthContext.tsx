// admin-frontend/src/context/AuthContext.tsx

import React, { useState, createContext, useEffect, useCallback, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as adminApi from '../services/adminApi';

interface UserInfo {
  id: string;
  username: string;
  role: string;
  token: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
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
  animeData: adminApi.Anime[]; // ✅ Required field that caused the error
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [animeData, setAnimeData] = useState<adminApi.Anime[]>([]); // ✅ Actual state

  const fetchInitialData = useCallback(async () => {
    try {
      const allGenres = await adminApi.fetchAllGenresAdmin();
      setGenres(allGenres.map(g => g.name));

      const allAnime = await adminApi.fetchAllAnimeAdmin();
      setAnimeData(allAnime);
    } catch (err) {
      console.error("Failed to fetch initial admin data:", err);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          if (decodedToken.exp * 1000 > Date.now()) {
            setIsAuthenticated(true);
            setUser({
              id: decodedToken.id,
              username: decodedToken.username,
              role: decodedToken.role,
              token
            });
            await fetchInitialData();
          } else {
            localStorage.removeItem('adminToken');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, [fetchInitialData]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await adminApi.loginAdmin({ username, password });
      localStorage.setItem('adminToken', res.token);
      setIsAuthenticated(true);
      setUser({
        id: res.id,
        username: res.username,
        role: res.role,
        token: res.token
      });
      await fetchInitialData();
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
    setCurrentPage('login');
    setSelectedAnimeId(null);
    setSelectedSeasonId(null);
    setSelectedEpisodeId(null);
    setGenres([]);
    setAnimeData([]);
  };

  const findAnime = useCallback((id: string) => animeData.find(a => a.id === id), [animeData]);
  const findSeason = useCallback((animeId: string, seasonId: string) => {
    const anime = findAnime(animeId);
    return anime?.seasons?.find(s => s.id === seasonId);
  }, [findAnime]);
  const findEpisode = useCallback((animeId: string, seasonId: string, episodeId: string) => {
    const season = findSeason(animeId, seasonId);
    return season?.episodes?.find(e => e.id === episodeId);
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
    findEpisode,
    animeData // ✅ ✅ ✅ Added here to fix the error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
