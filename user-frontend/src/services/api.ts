// user-frontend/src/services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

console.log("API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define types for your data models (updated for consistency with backend)
export interface Genre {
  id: string;
  name: string;
}

export interface Episode {
  id: string;
  title: string;
  link480p?: string;
  link720p?: string;
  link1080p?: string;
  seasonId: string; // Foreign key
}

export interface Season {
  id: string;
  title: string;
  // poster?: string; // REMOVED: Seasons no longer have their own poster
  animeId: string; // Foreign key
  episodes: Episode[]; // Populated episodes
}

export interface Anime {
  id: string;
  title: string;
  description?: string; // Optional
  poster?: string; // Only one poster for Anime, used across all pages
  // homepageBanner?: string; // REMOVED
  // seasonPageBanner?: string; // REMOVED
  // type?: string; // REMOVED
  // release?: string; // REMOVED
  genres: Genre[]; // Populated genres
  allDetails?: string;
  seasons: Season[]; // Populated seasons
}

// Public API functions
// Modified: fetchAnime now accepts an optional searchTerm
export const fetchAnime = async (searchTerm?: string): Promise<Anime[]> => {
  // Create an object for query parameters. If searchTerm exists, add it.
  const params = searchTerm ? { search: searchTerm } : {};
  const response = await api.get('/anime', { params }); // Pass the params object to axios
  return response.data;
};

export const fetchAnimeById = async (id: string): Promise<Anime> => {
  const response = await api.get(`/anime/${id}`);
  return response.data;
};

export const fetchGenres = async (): Promise<Genre[]> => {
  const response = await api.get('/genres');
  return response.data;
};

export const fetchSeasonById = async (id: string): Promise<Season> => {
  const response = await api.get(`/seasons/${id}`);
  return response.data;
};

export const fetchEpisodeById = async (id: string): Promise<Episode> => {
  const response = await api.get(`/episodes/${id}`);
  return response.data;
};
