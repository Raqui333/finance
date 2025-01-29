'use client';

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

export const theme = createTheme({
  palette: {
    text: {
      primary: '#ffffff',
    },
    primary: {
      main: '#318ede',
    },
    secondary: {
      main: '#0a2e50',
      contrastText: '#2391e6',
    },
    background: {
      default: '#0b1326',
      paper: '#151d34',
    },
    error: {
      main: '#d05574',
    },
    success: {
      main: '#00a889',
    },
    info: {
      main: '#2391e6',
    },
    divider: '#ffffff40',
  },
});

export default function MaterialThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
