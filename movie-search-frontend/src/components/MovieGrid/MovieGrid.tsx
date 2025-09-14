import React from 'react';
import styled from 'styled-components';
import { Movie } from '../../types';
import { MovieCard } from '../MovieCard/MovieCard';

interface MovieGridProps {
  movies: Movie[];
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => {
  return (
    <GridContainer>
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </GridContainer>
  );
};
