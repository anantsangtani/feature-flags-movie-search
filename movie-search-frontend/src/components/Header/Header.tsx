import React from 'react';
import styled from 'styled-components';

interface HeaderProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  isMaintenanceMode: boolean;
}

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ThemeButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  transition: all 0.2s ease-in-out;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const StatusBadge = styled.div<{ isMaintenanceMode: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  ${({ isMaintenanceMode, theme }) => isMaintenanceMode 
    ? `
      background-color: ${theme.colors.warning[50]};
      color: ${theme.colors.warning[800]};
      border: 1px solid ${theme.colors.warning[200]};
    `
    : `
      background-color: ${theme.colors.success[50]};
      color: ${theme.colors.success[800]};
      border: 1px solid ${theme.colors.success[200]};
    `
  }
`;

export const Header: React.FC<HeaderProps> = ({ 
  isDarkMode, 
  onThemeToggle, 
  isMaintenanceMode 
}) => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <LogoText>🎬 Movie Search</LogoText>
        </Logo>
        <HeaderActions>
          <StatusBadge isMaintenanceMode={isMaintenanceMode}>
            {isMaintenanceMode ? 'Maintenance Mode' : 'Online'}
          </StatusBadge>
          {/* <ThemeButton onClick={onThemeToggle} title="Toggle theme">
            {isDarkMode ? '☀️' : '🌙'}
          </ThemeButton> */}
        </HeaderActions>
      </HeaderContent>
    </HeaderContainer>
  );
};