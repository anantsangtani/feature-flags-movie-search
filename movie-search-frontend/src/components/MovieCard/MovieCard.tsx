import React, { useState } from 'react';
import styled from 'styled-components';
import { Movie } from '../../types';

interface MovieCardProps {
  movie: Movie;
}

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const PosterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  background-color: ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PosterPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.gray[400]};
  background: linear-gradient(45deg, ${({ theme }) => theme.colors.gray[100]}, ${({ theme }) => theme.colors.gray[200]});
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const MovieTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MovieMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const MovieYear = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const MovieType = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: capitalize;
  background-color: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[700]};
`;

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const hasPoster = movie.Poster && movie.Poster !== 'N/A' && !imageError;

  return (
    <Card>
      <PosterContainer>
        {hasPoster ? (
          <Poster
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <PosterPlaceholder>🎬</PosterPlaceholder>
        )}
      </PosterContainer>
      <CardContent>
        <MovieTitle>{movie.Title}</MovieTitle>
        <MovieMeta>
          <MovieYear>{movie.Year}</MovieYear>
          <MovieType>{movie.Type}</MovieType>
        </MovieMeta>
      </CardContent>
    </Card>
  );
};