import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useFlags } from '../hooks/useFlags';
import { Button } from '../components/Button/Button';
import { FlagForm } from '../components/FlagForm/FlagForm';
import { CreateFlagRequest } from '../types';

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

export const CreateFlagPage: React.FC = () => {
  const navigate = useNavigate();
  const { createFlag } = useFlags();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateFlagRequest) => {
    setLoading(true);
    try {
      await createFlag(data);
      navigate('/');
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader>
        <Title>Create New Feature Flag</Title>
        <Subtitle>Define a new feature flag to control application behavior.</Subtitle>
      </PageHeader>

      <FormContainer>
        <FlagForm
          onSubmit={handleSubmit}
          submitText="Create Flag"
          loading={loading}
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