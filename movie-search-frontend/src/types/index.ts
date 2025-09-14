export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface MovieSearchResponse {
  Search: Movie[] | null;
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface FlagStatus {
  darkMode: boolean;
  maintenanceMode: boolean;
  cacheStats: {
    totalFlags: number;
    enabledFlags: number;
    disabledFlags: number;
  };
}