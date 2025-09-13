import axios, { AxiosResponse } from 'axios';
import { FeatureFlag, FeatureFlagRequest } from '../types/FeatureFlag';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const featureFlagService = {
  // Get all feature flags
  getAllFlags: async (): Promise<FeatureFlag[]> => {
    const response = await api.get<FeatureFlag[]>('/flags');
    return response.data;
  },

  // Get feature flag by ID
  getFlagById: async (id: number): Promise<FeatureFlag> => {
    const response = await api.get<FeatureFlag>(`/flags/${id}`);
    return response.data;
  },

  // Create new feature flag
  createFlag: async (flag: FeatureFlagRequest): Promise<FeatureFlag> => {
    const response = await api.post<FeatureFlag>('/flags', flag);
    return response.data;
  },

  // Update feature flag
  updateFlag: async (id: number, flag: FeatureFlagRequest): Promise<FeatureFlag> => {
    const response = await api.put<FeatureFlag>(`/flags/${id}`, flag);
    return response.data;
  },

  // Toggle feature flag
  toggleFlag: async (id: number): Promise<FeatureFlag> => {
    const response = await api.post<FeatureFlag>(`/flags/${id}/toggle`);
    return response.data;
  },

  // Delete feature flag
  deleteFlag: async (id: number): Promise<void> => {
    await api.delete(`/flags/${id}`);
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/flags/health');
    return response.data;
  }
};

export default api;