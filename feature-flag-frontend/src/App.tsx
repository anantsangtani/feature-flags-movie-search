import React, { useState, useEffect } from 'react';
import { FeatureFlag, FeatureFlagRequest } from './types/FeatureFlag';
import { featureFlagService } from './services/apiService';
import FeatureFlagList from './components/FeatureFlagList';
import FeatureFlagForm from './components/FeatureFlagForm';
import './App.css';

interface AppState {
  flags: FeatureFlag[];
  isLoading: boolean;
  error: string | null;
  showForm: boolean;
  editingFlag: FeatureFlag | null;
  healthStatus: { status: string; timestamp: string } | null;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    flags: [],
    isLoading: false,
    error: null,
    showForm: false,
    editingFlag: null,
    healthStatus: null
  });

  useEffect(() => {
    loadFlags();
    checkHealth();

    const interval = setInterval(() => {
      loadFlags();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadFlags = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const flags = await featureFlagService.getAllFlags();
      setState(prev => ({
        ...prev,
        flags,
        isLoading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.response?.data?.message || error.message || 'Failed to load feature flags',
        isLoading: false
      }));
    }
  };

  const checkHealth = async () => {
    try {
      const health = await featureFlagService.healthCheck();
      setState(prev => ({ ...prev, healthStatus: health }));
    } catch (error) {
      console.warn('Health check failed:', error);
      setState(prev => ({ ...prev, healthStatus: null }));
    }
  };

  const handleCreateFlag = async (flagData: FeatureFlagRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await featureFlagService.createFlag(flagData);
      await loadFlags();
      setState(prev => ({
        ...prev,
        showForm: false,
        isLoading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.response?.data?.message || error.message || 'Failed to create feature flag',
        isLoading: false
      }));
    }
  };

  const handleUpdateFlag = async (flagData: FeatureFlagRequest) => {
    if (!state.editingFlag?.id) return;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await featureFlagService.updateFlag(state.editingFlag.id, flagData);
      await loadFlags();
      setState(prev => ({
        ...prev,
        showForm: false,
        editingFlag: null,
        isLoading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.response?.data?.message || error.message || 'Failed to update feature flag',
        isLoading: false
      }));
    }
  };

  const handleToggleFlag = async (id: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await featureFlagService.toggleFlag(id);
      await loadFlags();
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.response?.data?.message || error.message || 'Failed to toggle feature flag',
        isLoading: false
      }));
    }
  };

  const handleDeleteFlag = async (id: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await featureFlagService.deleteFlag(id);
      await loadFlags();
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.response?.data?.message || error.message || 'Failed to delete feature flag',
        isLoading: false
      }));
    }
  };

  const handleEditFlag = (flag: FeatureFlag) => {
    setState(prev => ({
      ...prev,
      editingFlag: flag,
      showForm: true
    }));
  };

  const handleCancelForm = () => {
    setState(prev => ({
      ...prev,
      showForm: false,
      editingFlag: null
    }));
  };

  const handleShowCreateForm = () => {
    setState(prev => ({
      ...prev,
      showForm: true,
      editingFlag: null
    }));
  };

  const dismissError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Feature Flag Manager</h1>
              <p className="text-gray-600 mt-1">Manage and control your application features</p>
            </div>
            {/* Health Status */}
            <div className="flex items-center space-x-2 text-sm">
              {state.healthStatus ? (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 ml-2">Service Healthy</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600 ml-2">Service Unavailable</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {state.error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex justify-between items-start">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{state.error}</p>
                </div>
              </div>
              <button
                onClick={dismissError}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {state.showForm
                ? (state.editingFlag ? 'Edit Feature Flag' : 'Create Feature Flag')
                : 'Feature Flags'
              }
            </h2>
          </div>
          {!state.showForm && (
            <div className="flex space-x-3">
              <button
                onClick={loadFlags}
                disabled={state.isLoading}
                className={`px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  state.isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {state.isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refreshing...
                  </span>
                ) : (
                  'Refresh'
                )}
              </button>
              <button
                onClick={handleShowCreateForm}
                disabled={state.isLoading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  state.isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Create Flag
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {state.showForm ? (
          <FeatureFlagForm
            flag={state.editingFlag || undefined}
            onSubmit={state.editingFlag ? handleUpdateFlag : handleCreateFlag}
            onCancel={handleCancelForm}
            isLoading={state.isLoading}
          />
        ) : (
          <FeatureFlagList
            flags={state.flags}
            onToggle={handleToggleFlag}
            onEdit={handleEditFlag}
            onDelete={handleDeleteFlag}
            isLoading={state.isLoading}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              Feature Flag Manager - Built with React & TypeScript
            </div>
            <div className="flex items-center space-x-4">
              <span>API Status: {state.healthStatus ? 'Connected' : 'Disconnected'}</span>
              {state.healthStatus && (
                <span className="text-xs">
                  Last updated: {new Date(state.healthStatus.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;