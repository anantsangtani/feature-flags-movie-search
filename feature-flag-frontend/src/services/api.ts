import axios from 'axios';
import { FeatureFlag, CreateFlagRequest, UpdateFlagRequest } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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

export const flagsApi = {
  // Get all flags
  getAll: async (): Promise<FeatureFlag[]> => {
    const response = await api.get('/flags');
    return response.data;
  },

  // Get flag by ID
  getById: async (id: number): Promise<FeatureFlag> => {
    const response = await api.get(`/flags/${id}`);
    return response.data;
  },

  // Create new flag
  create: async (flag: CreateFlagRequest): Promise<FeatureFlag> => {
    const response = await api.post('/flags', flag);
    return response.data;
  },

  // Update flag
  update: async (id: number, flag: UpdateFlagRequest): Promise<FeatureFlag> => {
    const response = await api.put(`/flags/${id}`, flag);
    return response.data;
  },

  // Delete flag
  delete: async (id: number): Promise<void> => {
    await api.delete(`/flags/${id}`);
  },

  // Toggle flag
  toggle: async (id: number): Promise<FeatureFlag> => {
    const response = await api.post(`/flags/${id}/toggle`);
    return response.data;
  },

  // Get stats
  getStats: async (): Promise<{ totalFlags: number; enabledFlags: number; disabledFlags: number }> => {
    const response = await api.get('/flags/stats');
    return response.data;
  },
};