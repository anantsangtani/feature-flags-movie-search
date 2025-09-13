import React, { useState, useEffect } from 'react';
import { FeatureFlag, FeatureFlagRequest } from '../types/FeatureFlag';

interface FeatureFlagFormProps {
  flag?: FeatureFlag;
  onSubmit: (flag: FeatureFlagRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const FeatureFlagForm: React.FC<FeatureFlagFormProps> = ({
  flag,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [formData, setFormData] = useState<FeatureFlagRequest>({
    name: '',
    enabled: false,
    description: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (flag) {
      setFormData({
        name: flag.name,
        enabled: flag.enabled,
        description: flag.description || ''
      });
    }
  }, [flag]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters, numbers, underscores, and hyphens';
    }

    if (formData.description && formData.description.length > 255) {
      newErrors.description = 'Description must be less than 255 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {flag ? 'Edit Feature Flag' : 'Create Feature Flag'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={isLoading || !!flag} // Disable name editing for existing flags
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="e.g., dark_mode, maintenance_mode"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            disabled={isLoading}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Describe what this feature flag controls..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="enabled"
            name="enabled"
            checked={formData.enabled}
            onChange={handleInputChange}
            disabled={isLoading}
            className={`mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
            Enabled
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={`px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {flag ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              flag ? 'Update Flag' : 'Create Flag'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeatureFlagForm;