import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../Button/Button';
import { Toggle } from '../Toggle/Toggle';

interface FlagFormData {
  name: string;
  enabled: boolean;
  description: string;
}

interface FlagFormProps {
  initialData?: Partial<FlagFormData>;
  onSubmit: (data: FlagFormData) => void;
  submitText: string;
  loading?: boolean;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[500]}20;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[500]}20;
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ToggleLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const HelpText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.danger[500]};
`;

export const FlagForm: React.FC<FlagFormProps> = ({
  initialData = {},
  onSubmit,
  submitText,
  loading = false,
}) => {
  const [formData, setFormData] = useState<FlagFormData>({
    name: initialData.name || '',
    enabled: initialData.enabled || false,
    description: initialData.description || '',
  });
  const [errors, setErrors] = useState<Partial<FlagFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FlagFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Flag name is required';
    } else if (!/^[a-z][a-z0-9_]*$/i.test(formData.name.trim())) {
      newErrors.name = 'Flag name must start with a letter and contain only letters, numbers, and underscores';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        enabled: formData.enabled,
        description: formData.description.trim(),
      });
    }
  };

  const handleInputChange = (field: keyof FlagFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="name">Flag Name *</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="e.g., dark_mode, new_feature_enabled"
          disabled={loading}
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
        <HelpText>
          Use a descriptive name with letters, numbers, and underscores only.
        </HelpText>
      </FormGroup>

      <FormGroup>
        <Label>Status</Label>
        <ToggleGroup>
          <Toggle
            checked={formData.enabled}
            onChange={(checked) => handleInputChange('enabled', checked)}
            disabled={loading}
          />
          <ToggleLabel>
            {formData.enabled ? 'Enabled' : 'Disabled'}
          </ToggleLabel>
        </ToggleGroup>
        <HelpText>
          Choose whether this flag should be enabled or disabled by default.
        </HelpText>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Optional description of what this flag controls..."
          disabled={loading}
        />
        <HelpText>
          Provide a clear description of what this feature flag controls.
        </HelpText>
      </FormGroup>

      <Button
        type="submit"
        loading={loading}
        disabled={loading}
        fullWidth
      >
        {submitText}
      </Button>
    </Form>
  );
};