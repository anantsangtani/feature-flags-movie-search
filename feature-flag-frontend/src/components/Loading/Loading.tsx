import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Spinner = styled.div<{ size: string }>`
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-top: 2px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `width: 20px; height: 20px;`;
      case 'lg':
        return `width: 40px; height: 40px;`;
      case 'md':
      default:
        return `width: 30px; height: 30px;`;
    }
  }}
`;

const LoadingText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text }) => {
  return (
    <LoadingContainer>
      <Spinner size={size} />
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
};