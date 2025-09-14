import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useFlag } from '../hooks/useFlag';
import { useFlags } from '../hooks/useFlags';
import { Button } from '../components/Button/Button';
import { FlagForm } from '../components/FlagForm/FlagForm';
import { Loading } from '../components/Loading/Loading';
import { UpdateFlagRequest } from '../types';

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const FormContainer = styled.div`
  max-width: 600px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export const EditFlagPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { flag, loading: flagLoading, error } = useFlag(id ? parseInt(id, 10) : undefined);
  const { updateFlag } = useFlags();
  const [submitting, setSubmitting] = useState(false);

  if (flagLoading) {
    return <Loading size="lg" text="Loading flag details..." />;
  }

  if (error || !flag) {
    return (
      <div>
        <h2>Error loading flag</h2>
        <p>{error || 'Flag not found'}</p>
        <Button onClick={() => navigate('/')}>Back to Flags</Button>
      </div>
    );
  }

  const handleSubmit = async (data: UpdateFlagRequest) => {
    setSubmitting(true);
    try {
      await updateFlag(flag.id, data);
      navigate('/');
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader>
        <Title>Edit Feature Flag</Title>
        <Subtitle>Update the settings for "{flag.name}".</Subtitle>
      </PageHeader>

      <FormContainer>
        <FlagForm
          initialData={{
            name: flag.name,
            enabled: flag.enabled,
            description: flag.description || '',
          }}
          onSubmit={handleSubmit}
          submitText="Update Flag"
          loading={submitting}
        />
        
        <ButtonGroup>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </FormContainer>
    </>
  );
};