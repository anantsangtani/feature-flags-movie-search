// src/components/MovieSearchForm.tsx
import React, { useState } from 'react';
import { SearchFilters } from '../types/Movie';

interface MovieSearchFormProps {
  onSearch: (query: string, filters: SearchFilters) => Promise<void>;
  isLoading: boolean;
  isDarkMode: boolean;
}

const MovieSearchForm: React.FC<MovieSearchFormProps> = ({
  onSearch,
  isLoading,
  isDarkMode
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a movie title to search');
      return;
    }
    
    if (query.trim().length < 2) {
      setError('Search query must be at least 2 characters long');
      return;
    }

    setError('');
    
    try {
      await onSearch(query.trim(), filters);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear error when user starts typing
    if (error && value.trim()) {
      setError('');
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-800 text-white border-gray-600' 
    : 'bg-white text-gray-900 border-gray-300';

  const inputClasses = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500';

  const selectClasses = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white'
    : 'bg-white border-gray-300 text-gray-900';

  return (
    <div className={`p-6 rounded-lg shadow-md ${themeClasses}`}>
      <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Search Movies
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search Input */}
        <div>
          <label htmlFor="query" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Movie Title *
          </label>
          <div className="relative">
            <input
              type="text"
              id="query"
              value={query}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClasses} ${
                error ? 'border-red-500' : ''
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="e.g., Batman, Avengers, The Matrix"
              maxLength={100}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type Filter */}
          <div>
            <label htmlFor="type" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Type
            </label>
            <select
              id="type"
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClasses} ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <option value="">All Types</option>
              <option value="movie">Movie</option>
              <option value="series">Series</option>
              <option value="episode">Episode</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label htmlFor="year" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Year
            </label>
            <input
              type="number"
              id="year"
              value={filters.year || ''}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              disabled={isLoading}
              min="1900"
              max={new Date().getFullYear()}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClasses} ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              placeholder="e.g., 2023"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
          <div className="flex space-x-2">
            {(filters.type || filters.year) && (
              <button
                type="button"
                onClick={clearFilters}
                disabled={isLoading}
                className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Clear Filters
              </button>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isLoading || !query.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              'Search Movies'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieSearchForm;