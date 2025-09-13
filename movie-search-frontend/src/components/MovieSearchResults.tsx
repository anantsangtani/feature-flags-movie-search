// src/components/MovieSearchResults.tsx
import React from 'react';
import { Movie } from '../types/Movie';

interface MovieSearchResultsProps {
  movies: Movie[];
  totalResults: string;
  searchQuery: string;
  isDarkMode: boolean;
  isLoading: boolean;
}

const MovieSearchResults: React.FC<MovieSearchResultsProps> = ({
  movies,
  totalResults,
  searchQuery,
  isDarkMode,
  isLoading
}) => {
  const containerClasses = isDarkMode 
    ? 'bg-gray-800 text-white border-gray-600' 
    : 'bg-white text-gray-900 border-gray-300';

  const cardClasses = isDarkMode
    ? 'bg-gray-700 hover:bg-gray-600 border-gray-600'
    : 'bg-white hover:bg-gray-50 border-gray-200';

  const NoResultsMessage = () => (
    <div className={`text-center py-12 ${containerClasses} rounded-lg shadow-md`}>
      <svg 
        className={`mx-auto h-12 w-12 mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}
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
      <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
        No movies found
      </h3>
      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {searchQuery 
          ? `No results found for "${searchQuery}". Try a different search term.`
          : 'Search for movies to see results here.'
        }
      </p>
    </div>
  );

  const LoadingState = () => (
    <div className={`text-center py-12 ${containerClasses} rounded-lg shadow-md`}>
      <svg className="animate-spin mx-auto h-8 w-8 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
        Searching for movies...
      </p>
    </div>
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (movies.length === 0) {
    return <NoResultsMessage />;
  }

  return (
    <div className={`${containerClasses} rounded-lg shadow-md overflow-hidden`}>
      {/* Results Header */}
      <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Search Results
        </h2>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Found {parseInt(totalResults).toLocaleString()} results for "{searchQuery}"
        </p>
      </div>

      {/* Results Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.imdbID} 
              movie={movie} 
              isDarkMode={isDarkMode} 
              cardClasses={cardClasses}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface MovieCardProps {
  movie: Movie;
  isDarkMode: boolean;
  cardClasses: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isDarkMode, cardClasses }) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'movie':
        return isDarkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800';
      case 'series':
        return isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800';
      case 'episode':
        return isDarkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800';
      default:
        return isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  const PlaceholderImage = () => (
    <div className={`w-full h-64 flex items-center justify-center ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-t-lg`}>
      <svg 
        className={`w-12 h-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
        />
      </svg>
    </div>
  );

  return (
    <div className={`${cardClasses} border rounded-lg shadow-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1`}>
      {/* Movie Poster */}
      <div className="relative">
        {imageLoading && (
          <div className={`w-full h-64 flex items-center justify-center ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-t-lg`}>
            <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {imageError || movie.Poster === 'N/A' ? (
          <PlaceholderImage />
        ) : (
          <img
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            className={`w-full h-64 object-cover rounded-t-lg ${imageLoading ? 'hidden' : 'block'}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}
        
        {/* Type Badge */}
        <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(movie.Type)}`}>
          {movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}
        </span>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className={`font-semibold text-sm mb-2 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} title={movie.Title}>
          {movie.Title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {movie.Year}
          </span>
          
          <a
            href={`https://www.imdb.com/title/${movie.imdbID}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs px-2 py-1 rounded-md transition-colors ${
              isDarkMode
                ? 'bg-yellow-800 text-yellow-200 hover:bg-yellow-700'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
            title="View on IMDb"
          >
            IMDb
          </a>
        </div>
      </div>
    </div>
  );
};

export default MovieSearchResults;