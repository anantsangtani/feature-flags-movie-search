export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface MovieSearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface FeatureFlagStatus {
  [key: string]: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp?: string;
}

export interface SearchFilters {
  type?: 'movie' | 'series' | 'episode';
  year?: string;
}