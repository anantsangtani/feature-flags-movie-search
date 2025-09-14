import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useFlags } from '../hooks/useFlags';
import { Button } from '../components/Button/Button';
import { Toggle } from '../components/Toggle/Toggle';
import { Loading } from '../components/Loading/Loading';
import { FlagCard } from '../components/FlagCard/FlagCard';
import { ConfirmModal } from '../components/Modal/ConfirmModal';

const PageHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  flex: 1;
  margin: 0;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  min-width: 120px;
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const FlagsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  opacity: 0.5;
`;

export const FlagsListPage: React.FC = () => {
  const { flags, loading, error, toggleFlag, deleteFlag } = useFlags();
  const [flagToDelete, setFlagToDelete] = useState<number | null>(null);

  const handleToggle = async (id: number) => {
    await toggleFlag(id);
  };

  const handleDelete = async () => {
    if (flagToDelete) {
      await deleteFlag(flagToDelete);
      setFlagToDelete(null);
    }
  };

  if (loading) {
    return <Loading size="lg" text="Loading feature flags..." />;
  }

  if (error) {
    return (
      <div>
        <h2>Error loading flags</h2>
        <p>{error}</p>
      </div>
    );
  }

  const totalFlags = flags.length;
  const enabledFlags = flags.filter(flag => flag.enabled).length;
  const disabledFlags = totalFlags - enabledFlags;

  return (
    <>
      <PageHeader>
        <Title>Feature Flags</Title>
        <Button as={Link} to="/create">
          Create New Flag
        </Button>
      </PageHeader>

      <StatsContainer>
        <StatCard>
          <StatNumber>{totalFlags}</StatNumber>
          <StatLabel>Total Flags</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber style={{ color: '#22c55e' }}>{enabledFlags}</StatNumber>
          <StatLabel>Enabled</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber style={{ color: '#ef4444' }}>{disabledFlags}</StatNumber>
          <StatLabel>Disabled</StatLabel>
        </StatCard>
      </StatsContainer>

      {flags.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🚩</EmptyIcon>
          <h3>No feature flags yet</h3>
          <p>Get started by creating your first feature flag.</p>
          <Button as={Link} to="/create" style={{ marginTop: '1rem' }}>
            Create First Flag
          </Button>
        </EmptyState>
      ) : (
        <FlagsGrid>
          {flags.map(flag => (
            <FlagCard
              key={flag.id}
              flag={flag}
              onToggle={() => handleToggle(flag.id)}
              onDelete={() => setFlagToDelete(flag.id)}
            />
          ))}
        </FlagsGrid>
      )}

      <ConfirmModal
        isOpen={flagToDelete !== null}
        onClose={() => setFlagToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Feature Flag"
        message={`Are you sure you want to delete "${flags.find(f => f.id === flagToDelete)?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </>
  );
};
