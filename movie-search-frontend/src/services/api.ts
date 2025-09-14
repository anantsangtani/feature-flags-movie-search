import axios from 'axios';
import { MovieSearchResponse, FlagStatus } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API] Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const moviesApi = {
  // Search movies
  search: async (title: string, page = 1): Promise<MovieSearchResponse> => {
    const response = await api.get('/movies/search', {
      params: { title, page }
    });
    return response.data;
  },

  // Get movie details by IMDB ID
  getDetails: async (imdbId: string): Promise<MovieSearchResponse> => {
    const response = await api.get(`/movies/${imdbId}`);
    return response.data;
  },
};

export const flagsApi = {
  // Get flag status
  getFlagStatus: async (): Promise<FlagStatus> => {
    const response = await api.get('/flags/status');
    return response.data;
  },

  // Refresh flags manually
  refreshFlags: async (): Promise<void> => {
    await api.post('/flags/refresh');
  },
};
