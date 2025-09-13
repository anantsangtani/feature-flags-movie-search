import axios, { AxiosResponse } from 'axios';
import { MovieSearchResponse, FeatureFlagStatus } from '../types/Movie';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for movie searches
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle maintenance mode
    if (error.response?.status === 503) {
      const maintenanceError = {
        ...error,
        isMaintenanceMode: true
      };
      return Promise.reject(maintenanceError);
    }
    
    return Promise.reject(error);
  }
);

export const movieService = {
  // Search movies
  searchMovies: async (
    title: string,
    type?: string,
    year?: string
  ): Promise<MovieSearchResponse> => {
    const params = new URLSearchParams({ title });
    if (type) params.append('type', type);
    if (year) params.append('year', year);
    
    const response = await api.get<MovieSearchResponse>(`/movies/search?${params.toString()}`);
    return response.data;
  },

  // Get feature flag status
  getFeatureFlagStatus: async (): Promise<FeatureFlagStatus> => {
    const response = await api.get<FeatureFlagStatus>('/flags/status');
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;