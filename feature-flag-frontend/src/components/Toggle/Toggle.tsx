import React from 'react';
import styled, { css } from 'styled-components';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

const ToggleContainer = styled.button<{ checked: boolean; size: string }>`
  position: relative;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  outline: none;
  
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return css`
          width: 36px;
          height: 20px;
        `;
      case 'md':
      default:
        return css`
          width: 44px;
          height: 24px;
        `;
    }
  }}
  
  ${({ checked, theme }) => checked 
    ? css`
        background-color: ${theme.colors.primary[500]};
      `
    : css`
        background-color: ${theme.colors.gray[300]};
      `
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus-visible {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[500]}40;
  }
`;

const ToggleThumb = styled.div<{ checked: boolean; size: string }>`
  position: absolute;
  top: 2px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  ${({ size, checked }) => {
    switch (size) {
      case 'sm':
        return css`
          width: 16px;
          height: 16px;
          left: ${checked ? '18px' : '2px'};
        `;
      case 'md':
      default:
        return css`
          width: 20px;
          height: 20px;
          left: ${checked ? '22px' : '2px'};
        `;
    }
  }}
`;

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <ToggleContainer
      type="button"
      checked={checked}
      size={size}
      disabled={disabled}
      onClick={handleClick}
    >
      <ToggleThumb checked={checked} size={size} />
    </ToggleContainer>
  );
};