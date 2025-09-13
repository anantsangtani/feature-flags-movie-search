import React from 'react';
import { FeatureFlag } from '../types/FeatureFlag';

interface FeatureFlagListProps {
  flags: FeatureFlag[];
  onToggle: (id: number) => Promise<void>;
  onEdit: (flag: FeatureFlag) => void;
  onDelete: (id: number) => Promise<void>;
  isLoading: boolean;
}

const FeatureFlagList: React.FC<FeatureFlagListProps> = ({
  flags,
  onToggle,
  onEdit,
  onDelete,
  isLoading
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const handleToggle = async (id: number) => {
    if (isLoading) return;
    try {
      await onToggle(id);
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (isLoading) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete the feature flag "${name}"? This action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  if (flags.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-gray-500 text-lg mb-4">No feature flags found</div>
        <div className="text-gray-400 text-sm">
          Create your first feature flag to get started
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Feature Flags</h2>
        <p className="text-sm text-gray-600 mt-1">
          {flags.length} flag{flags.length !== 1 ? 's' : ''} total
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {flags.map((flag) => (
          <div
            key={flag.id}
            className={`p-6 hover:bg-gray-50 transition-colors ${
              isLoading ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{flag.name}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      flag.enabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {flag.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                {flag.description && (
                  <p className="text-gray-600 text-sm mb-3">{flag.description}</p>
                )}
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Created: {formatDate(flag.createdAt)}</div>
                  <div>Updated: {formatDate(flag.updatedAt)}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {/* Toggle Switch */}
                <button
                  onClick={() => flag.id && handleToggle(flag.id)}
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    flag.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  title={`${flag.enabled ? 'Disable' : 'Enable'} ${flag.name}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      flag.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => onEdit(flag)}
                  disabled={isLoading}
                  className={`p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title={`Edit ${flag.name}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => flag.id && flag.name && handleDelete(flag.id, flag.name)}
                  disabled={isLoading}
                  className={`p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title={`Delete ${flag.name}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureFlagList;