import { useState } from 'react';
import { Movie, MovieSearchResponse } from '../types';
import { moviesApi } from '../services/api';
import { toast } from '../utils/toast';

export const useMovieSearch = () => {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState('0');
  const [searchTerm, setSearchTerm] = useState('');

  const searchMovies = async (title: string, page = 1) => {
    if (!title.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setSearchTerm(title);

      const response = await moviesApi.search(title.trim(), page);

      if (response.Response === 'True' && response.Search) {
        setMovies(response.Search);
        setTotalResults(response.totalResults || '0');
        toast.success(`Found ${response.totalResults} movies`);
      } else {
        setMovies([]);
        setTotalResults('0');
        const errorMessage = response.Error || 'No movies found';
        setError(errorMessage);
        toast.info(errorMessage);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to search movies';
      setError(message);
      setMovies(null);
      setTotalResults('0');
      
      if (err.response?.status === 503) {
        toast.warning('Movie search is currently under maintenance');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setMovies(null);
    setError(null);
    setTotalResults('0');
    setSearchTerm('');
  };

  return {
    movies,
    loading,
    error,
    totalResults,
    searchTerm,
    searchMovies,
    clearSearch,
  };
};