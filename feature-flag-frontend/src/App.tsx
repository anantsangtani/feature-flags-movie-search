import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { Header } from './components/Header/Header';
import { FlagsListPage } from './pages/FlagsListPage';
import { CreateFlagPage } from './pages/CreateFlagPage';
import { EditFlagPage } from './pages/EditFlagPage';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Toaster } from './components/Toast/Toaster';
import { AppContainer, MainContent } from './styles/AppStyles';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles theme={theme}/>
      <ErrorBoundary>
        <Router>
          <AppContainer>
            <Header />
            <MainContent>
              <Routes>
                <Route path="/" element={<FlagsListPage />} />
                <Route path="/create" element={<CreateFlagPage />} />
                <Route path="/edit/:id" element={<EditFlagPage />} />
              </Routes>
            </MainContent>
          </AppContainer>
        </Router>
        <Toaster />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;