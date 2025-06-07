// admin-frontend/src/services/adminApi.ts

import axios from 'axios';

// Define interfaces based on your backend response structure
export interface Genre {
  id: string;
  name: string;
}

export interface Episode {
  id: string;
  title: string;
  link480p?: string; // 480p link
  link720p?: string; // 720p link
  link1080p?: string; // 1080p link
  seasonId: string;
}

export interface Season {
  id: string;
  title: string; // CORRECTED: Title property was missing its type
  // Season no longer has its own poster
  animeId: string; // The ID of the anime this season belongs to
  episodes: Episode[];
}

export interface Anime {
  id: string;
  title: string;
  description?: string;
  poster?: string; // Only one poster for Anime, used across all pages
  allDetails?: string;
  genres: Genre[]; // Array of Genre objects
  seasons: Season[]; // Array of Season objects
}

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || 'http://localhost:5000/api';

// Create an Axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth API Calls ---
export const loginAdmin = async (credentials: { username: string; password: string }) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

// --- Genre API Calls ---
export const fetchAllGenresAdmin = async (): Promise<Genre[]> => {
  const { data } = await api.get('/genres');
  return data;
};

export const addGenreAdmin = async (name: string): Promise<Genre> => {
  const { data } = await api.post('/genres', { name });
  return data;
};

export const deleteGenreAdmin = async (id: string): Promise<void> => {
  await api.delete(`/genres/${id}`);
};

// --- Anime API Calls ---
export const fetchAllAnimeAdmin = async (): Promise<Anime[]> => {
  const { data } = await api.get('/anime');
  return data;
};

export const fetchAnimeByIdAdmin = async (id: string): Promise<Anime> => {
  const { data } = await api.get(`/anime/${id}`);
  return data;
};

export const addAnimeAdmin = async (animeData: Partial<Omit<Anime, 'genres' | 'seasons'>>, genreNames: string[]): Promise<Anime> => {
  // genreNames are now passed as a separate argument to the backend controller, not part of animeData
  const { data } = await api.post('/anime', { ...animeData, genreNames });
  return data;
};

export const updateAnimeAdmin = async (id: string, animeData: Partial<Omit<Anime, 'genres' | 'seasons'>>, genreNames: string[]): Promise<Anime> => {
  // genreNames are now passed as a separate argument to the backend controller, not part of animeData
  const { data } = await api.put(`/anime/${id}`, { ...animeData, genreNames });
  return data;
};

export const deleteAnimeAdmin = async (id: string): Promise<void> => {
  await api.delete(`/anime/${id}`);
};

// --- Season API Calls ---
export const addSeasonAdmin = async (animeId: string, seasonData: { title: string }): Promise<Season> => { // Removed poster from seasonData
  const { data } = await api.post(`/anime/${animeId}/seasons`, seasonData);
  return data;
};

export const updateSeasonAdmin = async (id: string, seasonData: { title: string }): Promise<Season> => { // Removed poster from seasonData
  const { data } = await api.put(`/seasons/${id}`, seasonData);
  return data;
};

export const deleteSeasonAdmin = async (id: string): Promise<void> => {
  await api.delete(`/seasons/${id}`);
};

// --- Episode API Calls ---
export const addEpisodeAdmin = async (seasonId: string, episodeData: Partial<Omit<Episode, 'seasonId'>>): Promise<Episode> => {
  const { data } = await api.post(`/seasons/${seasonId}/episodes`, episodeData);
  return data;
};

export const updateEpisodeAdmin = async (id: string, episodeData: Partial<Omit<Episode, 'seasonId'>>): Promise<Episode> => {
  const { data } = await api.put(`/episodes/${id}`, episodeData);
  return data;
};

export const deleteEpisodeAdmin = async (id: string): Promise<void> => {
  await api.delete(`/episodes/${id}`);
};
