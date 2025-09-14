import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  as?: React.ElementType;
  to?: string;
}

const getVariantStyles = (variant: string, theme: any): ReturnType<typeof css> => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${theme.colors.primary[500]};
        color: ${theme.colors.white};
        border: 1px solid ${theme.colors.primary[500]};
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary[600]};
          border-color: ${theme.colors.primary[600]};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${theme.colors.white};
        color: ${theme.colors.gray[700]};
        border: 1px solid ${theme.colors.gray[300]};
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.gray[50]};
          border-color: ${theme.colors.gray[400]};
        }
      `;
    case 'success':
      return css`
        background-color: ${theme.colors.success[500]};
        color: ${theme.colors.white};
        border: 1px solid ${theme.colors.success[500]};
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.success[600]};
          border-color: ${theme.colors.success[600]};
        }
      `;
    case 'danger':
      return css`
        background-color: ${theme.colors.danger[500]};
        color: ${theme.colors.white};
        border: 1px solid ${theme.colors.danger[500]};
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.danger[600]};
          border-color: ${theme.colors.danger[600]};
        }
      `;
    default:
      return getVariantStyles('primary', theme);
  }
};

const getSizeStyles = (size: string, theme: any) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: ${theme.typography.fontSize.sm};
        height: 32px;
      `;
    case 'lg':
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.lg};
        font-size: ${theme.typography.fontSize.lg};
        height: 44px;
      `;
    case 'md':
    default:
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.typography.fontSize.base};
        height: 40px;
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  outline: none;
  
  ${({ variant = 'primary', theme }) => getVariantStyles(variant, theme)}
  ${({ size = 'md', theme }) => getSizeStyles(size, theme)}
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus-visible {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[500]}40;
  }
  
  ${({ loading }) => loading && css`
    cursor: not-allowed;
    opacity: 0.8;
  `}
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton disabled={disabled || loading} {...props}>
      {loading && <Spinner />}
      {children}
    </StyledButton>
  );
};