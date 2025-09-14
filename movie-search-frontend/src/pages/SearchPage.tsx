import React, { useState } from 'react';
import styled from 'styled-components';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import { Loading } from '../components/Loading/Loading';
import { useMovieSearch } from '../hooks/useMovieSearch';

const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
`;

const ResultsSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ResultsTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`;

const ResultsCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.danger[600]};
  background-color: ${({ theme }) => theme.colors.danger[50]};
  border: 1px solid ${({ theme }) => theme.colors.danger[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const NoResultsIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  opacity: 0.5;
`;

export const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { movies, loading, error, totalResults, searchMovies } = useMovieSearch();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      searchMovies(term);
    }
  };

  const renderContent = () => {
    if (error) {
      return <ErrorMessage>{error}</ErrorMessage>;
    }

    if (loading) {
      return <Loading size="lg" text="Searching movies..." />;
    }

    if (searchTerm && movies && movies.length === 0) {
      return (
        <NoResults>
          <NoResultsIcon>🔍</NoResultsIcon>
          <h3>No movies found</h3>
          <p>Try searching with different keywords.</p>
        </NoResults>
      );
    }

    if (movies && movies.length > 0) {
      return (
        <ResultsSection>
          <ResultsHeader>
            <ResultsTitle>Search Results</ResultsTitle>
            <ResultsCount>
              {totalResults} {parseInt(totalResults) === 1 ? 'result' : 'results'} found
            </ResultsCount>
          </ResultsHeader>
          <MovieGrid movies={movies} />
        </ResultsSection>
      );
    }

    return null;
  };

  return (
    <SearchContainer>
      <Hero>
        <HeroTitle>Discover Movies</HeroTitle>
        <HeroSubtitle>
          Search through thousands of movies and discover your next favorite film
        </HeroSubtitle>
        <SearchBar onSearch={handleSearch} />
      </Hero>
      {renderContent()}
    </SearchContainer>
  );
};