import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FeatureFlag } from '../../types';
import { Toggle } from '../Toggle/Toggle';
import { Button } from '../Button/Button';

interface FlagCardProps {
  flag: FeatureFlag;
  onToggle: () => void;
  onDelete: () => void;
}

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-1px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FlagInfo = styled.div`
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.md};
`;

const FlagName = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const FlagStatus = styled.span<{ enabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  ${({ enabled, theme }) => enabled 
    ? `
      background-color: ${theme.colors.success[50]};
      color: ${theme.colors.success[600]};
    `
    : `
      background-color: ${theme.colors.gray[100]};
      color: ${theme.colors.gray[600]};
    `
  }
`;

const StatusDot = styled.div<{ enabled: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ enabled, theme }) => 
    enabled ? theme.colors.success[500] : theme.colors.gray[400]};
`;

const FlagDescription = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.4;
`;

const FlagMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[100]};
`;

const MetaInfo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

export const FlagCard: React.FC<FlagCardProps> = ({ flag, onToggle, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <FlagInfo>
          <FlagName>{flag.name}</FlagName>
          <FlagStatus enabled={flag.enabled}>
            <StatusDot enabled={flag.enabled} />
            {flag.enabled ? 'Enabled' : 'Disabled'}
          </FlagStatus>
        </FlagInfo>
        <Toggle
          checked={flag.enabled}
          onChange={onToggle}
        />
      </CardHeader>

      {flag.description && (
        <FlagDescription>{flag.description}</FlagDescription>
      )}

      <FlagMeta>
        <MetaInfo>
          Created {formatDate(flag.createdAt)}
        </MetaInfo>
        <Actions>
          <Button
            as={Link}
            to={`/edit/${flag.id}`}
            variant="secondary"
            size="sm"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
          >
            Delete
          </Button>
        </Actions>
      </FlagMeta>
    </Card>
  );
};
