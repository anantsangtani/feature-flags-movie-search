import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.gray['900']};
    background-color: ${({ theme }) => theme.colors.gray['50']};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.gray['900']};
  }

  h1 { font-size: ${({ theme }) => theme.typography.fontSize['3xl']}; }
  h2 { font-size: ${({ theme }) => theme.typography.fontSize['2xl']}; }
  h3 { font-size: ${({ theme }) => theme.typography.fontSize.xl}; }
  h4 { font-size: ${({ theme }) => theme.typography.fontSize.lg}; }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.gray['600']};
  }

  a {
    color: ${({ theme }) => theme.colors.primary['500']};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.primary['600']};
      text-decoration: underline;
    }
  }

  button {
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }

  /* Focus styles */
  *:focus {
    outline: none;
  }

  *:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary['500']};
    outline-offset: 2px;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray['100']};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray['300']};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray['400']};
  }
`;
