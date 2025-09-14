
import React from 'react';
import styled from 'styled-components';

const MaintenanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const MaintenanceIcon = styled.div`
  font-size: 6rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  opacity: 0.8;
`;

const MaintenanceTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.warning[600]};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
`;

const MaintenanceMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  max-width: 500px;
  line-height: 1.6;
`;

const MaintenanceSubtext = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0;
`;

export const MaintenancePage: React.FC = () => {
  return (
    <MaintenanceContainer>
      <MaintenanceIcon>🚧</MaintenanceIcon>
      <MaintenanceTitle>Service Under Maintenance</MaintenanceTitle>
      <MaintenanceMessage>
        We're currently performing scheduled maintenance to improve your experience. 
        The movie search service will be back online shortly.
      </MaintenanceMessage>
      <MaintenanceSubtext>
        Thank you for your patience. Please try again in a few minutes.
      </MaintenanceSubtext>
    </MaintenanceContainer>
  );
};