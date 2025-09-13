// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Movie, MovieSearchResponse, FeatureFlagStatus, SearchFilters } from './types/Movie';
import { movieService } from './services/apiService';
import MovieSearchForm from './components/MovieSearchForm';
import MovieSearchResults from './components/MovieSearchResults';
import MaintenancePage from './components/MaintenancePage';
import './App.css';

interface AppState {
  movies: Movie[];
  totalResults: string;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  featureFlags: FeatureFlagStatus;
  isMaintenanceMode: boolean;
  healthStatus: { status: string; timestamp: string } | null;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    movies: [],
    totalResults: '0',
    searchQuery: '',
    isLoading: false,
    error: null,
    featureFlags: {},
    isMaintenanceMode: false,
    healthStatus: null
  });

  // Check feature flags and health on component mount and then every 30 seconds
  useEffect(() => {
    checkFeatureFlags();
    checkHealth();
    
    const interval = setInterval(() => {
      checkFeatureFlags();
      checkHealth();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Check for maintenance mode when feature flags change
  useEffect(() => {
    const maintenanceMode = state.featureFlags.maintenance_mode || false;
    setState(prev => ({ 
      ...prev, 
      isMaintenanceMode: maintenanceMode 
    }));
  }, [state.featureFlags]);

  const checkFeatureFlags = async () => {
    try {
      const flags = await movieService.getFeatureFlagStatus();
      setState(prev => ({ 
        ...prev, 
        featureFlags: flags 
      }));
    } catch (error) {
      console.warn('Failed to fetch feature flags:', error);
      // Don't show error to user, just log it
    }
  };

  const checkHealth = async () => {
    try {
      const health = await movieService.healthCheck();
      setState(prev => ({ ...prev, healthStatus: health }));
    } catch (error) {
      console.warn('Health check failed:', error);
      setState(prev => ({ ...prev, healthStatus: null }));
    }
  };

  const handleSearch = async (query: string, filters: SearchFilters) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      searchQuery: query 
    }));

    try {
      const response: MovieSearchResponse = await movieService.searchMovies(
        query,
        filters.type,
        filters.year
      );

      if (response.Response === 'True') {
        setState(prev => ({
          ...prev,
          movies: response.Search || [],
          totalResults: response.totalResults || '0',
          isLoading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          movies: [],
          totalResults: '0',
          error: response.Error || 'No movies found',
          isLoading: false
        }));
      }
    } catch (error: any) {
      console.error('Search error:', error);
      
      // Handle maintenance mode
      if (error.isMaintenanceMode) {
        setState(prev => ({
          ...prev,
          isMaintenanceMode: true,
          isLoading: false
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        movies: [],
        totalResults: '0',
        error: error.response?.data?.message || error.message || 'Failed to search movies',
        isLoading: false
      }));
    }
  };

  const handleRetryFromMaintenance = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await checkFeatureFlags();
      await checkHealth();
      
      // Small delay to show the retry action
      setTimeout(() => {
        setState(prev => ({ ...prev, isLoading: false }));
      }, 1000);
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const toggleDarkMode = () => {
    setState(prev => ({
      ...prev,
      featureFlags: {
        ...prev.featureFlags,
        dark_mode: !prev.featureFlags.dark_mode
      }
    }));
  };

  const dismissError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Dark mode from feature flags
  const isDarkMode = state.featureFlags.dark_mode || false;

  // Show maintenance page if maintenance mode is enabled
  if (state.isMaintenanceMode) {
    return (
      <MaintenancePage
        isDarkMode={isDarkMode}
        onRetry={handleRetryFromMaintenance}
        isRetrying={state.isLoading}
      />
    );
  }

  const containerClasses = isDarkMode 
    ? 'min-h-screen bg-gray-900 text-white' 
    : 'min-h-screen bg-gray-100 text-gray-900';

  const headerClasses = isDarkMode 
    ? 'bg-gray-800 shadow-sm border-b border-gray-700' 
    : 'bg-white shadow-sm border-b border-gray-200';

  const footerClasses = isDarkMode 
    ? 'border-t border-gray-700 bg-gray-800' 
    : 'border-t border-gray-200 bg-white';

  return (
    <div className={containerClasses}>
      {/* Header */}
      <header className={headerClasses}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Movie Search
              </h1>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Discover your favorite movies and TV shows
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-md transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              
              {/* Health Status */}
              {state.healthStatus && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Service Healthy
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {state.error && (
          <div className={`mb-6 p-4 rounded-md border ${
            isDarkMode 
              ? 'bg-red-900 border-red-700 text-red-200' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex justify-between items-start">
              <div className="flex">
                <svg className={`h-5 w-5 mt-0.5 mr-3 ${isDarkMode ? 'text-red-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className={`text-sm font-medium ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                    Search Error
                  </h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                    {state.error}
                  </p>
                </div>
              </div>
              <button
                onClick={dismissError}
                className={`ml-4 ${isDarkMode ? 'text-red-300 hover:text-red-400' : 'text-red-400 hover:text-red-600'}`}
                title="Dismiss error"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Search Form */}
        <MovieSearchForm
          onSearch={handleSearch}
          isLoading={state.isLoading}
          isDarkMode={isDarkMode}
        />

        {/* Search Results */}
        <MovieSearchResults
          movies={state.movies}
          totalResults={state.totalResults}
          isLoading={state.isLoading}
          searchQuery={state.searchQuery}
          isDarkMode={isDarkMode}
        />
      </main>

      {/* Footer */}
      <footer className={footerClasses}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center text-sm">
            <div>
              Movie Search - Powered by OMDb API
            </div>
            <div className="flex items-center space-x-4">
              <span>API Status: {state.healthStatus ? 'Connected' : 'Disconnected'}</span>
              {state.healthStatus && (
                <span className="text-xs">
                  Last checked: {new Date(state.healthStatus.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;