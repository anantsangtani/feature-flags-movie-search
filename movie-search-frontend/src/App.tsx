import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/theme';
import { Header } from './components/Header/Header';
import { SearchPage } from './pages/SearchPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Toaster } from './components/Toast/Toaster';
import { AppContainer, MainContent } from './styles/AppStyles';
import { flagsApi } from './services/api';
import { toast } from './utils/toast';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check flag status on mount and periodically
  useEffect(() => {
    const checkFlags = async () => {
      try {
        const flagStatus = await flagsApi.getFlagStatus();
        setIsDarkMode(flagStatus.darkMode);
        setIsMaintenanceMode(flagStatus.maintenanceMode);
      } catch (error) {
        console.warn('Failed to fetch flag status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkFlags();
    
    // Poll for flag changes every 5 seconds
    const interval = setInterval(checkFlags, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev);
    toast.info(`Switched to ${isDarkMode ? 'light' : 'dark'} mode`);
  };

  if (loading) {
    return (
      <ThemeProvider theme={lightTheme}>
        <GlobalStyles />
        <AppContainer>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}>
            <div>Loading...</div>
          </div>
        </AppContainer>
      </ThemeProvider>
    );
  }

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <ErrorBoundary>
        <AppContainer>
          <Header 
            isDarkMode={isDarkMode} 
            onThemeToggle={handleThemeToggle}
            isMaintenanceMode={isMaintenanceMode}
          />
          <MainContent>
            {isMaintenanceMode ? <MaintenancePage /> : <SearchPage />}
          </MainContent>
        </AppContainer>
        <Toaster />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;