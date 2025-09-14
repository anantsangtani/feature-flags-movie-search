import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

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

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary[600] : theme.colors.gray[600]};
  background-color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary[50] : 'transparent'};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
    background-color: ${({ theme }) => theme.colors.primary[50]};
    text-decoration: none;
  }
`;

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <LogoText>🚩 Feature Flags</LogoText>
        </Logo>
      </HeaderContent>
    </HeaderContainer>
  );
};