// src/components/MaintenancePage.tsx
import React from 'react';

interface MaintenancePageProps {
  isDarkMode: boolean;
  onRetry: () => void;
  isRetrying: boolean;
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({
  isDarkMode,
  onRetry,
  isRetrying
}) => {
  const containerClasses = isDarkMode 
    ? 'bg-gray-800 text-white' 
    : 'bg-white text-gray-900';

  const iconClasses = isDarkMode ? 'text-orange-400' : 'text-orange-500';

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full ${containerClasses} rounded-lg shadow-lg p-8 text-center`}>
        {/* Maintenance Icon */}
        <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${isDarkMode ? 'bg-orange-900' : 'bg-orange-100'} mb-6`}>
          <svg
            className={`h-8 w-8 ${iconClasses}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Under Maintenance
        </h1>

        {/* Description */}
        <p className={`text-base mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          We're currently performing scheduled maintenance to improve your movie search experience. 
          The service will be back online shortly.
        </p>

        {/* Status Messages */}
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-6`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Movie Search Service
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isDarkMode ? 'bg-orange-800 text-orange-200' : 'bg-orange-100 text-orange-800'
              }`}>
                Offline
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Feature Flags Service
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
              }`}>
                Online
              </span>
            </div>
          </div>
        </div>

        {/* What's Being Updated */}
        <div className={`text-left mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            What we're updating:
          </h3>
          <ul className="text-sm space-y-1">
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Improving search performance
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Database optimization
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Security enhancements
            </li>
          </ul>
        </div>

        {/* Retry Button */}
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
            isRetrying ? 'opacity-50 cursor-not-allowed' : ''
          } ${isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`}
        >
          {isRetrying ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking Status...
            </span>
          ) : (
            'Try Again'
          )}
        </button>

        {/* Additional Info */}
        <div className={`mt-6 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>
            If this issue persists, please contact our support team.
          </p>
          <p className="mt-1">
            Expected resolution time: 15-30 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;