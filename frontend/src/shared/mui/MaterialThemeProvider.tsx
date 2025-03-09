'use client';

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    text: {
      primary: '#ffffff',
      secondary: '#ffffff80',
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
      paper: '#081027',
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
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.spacing(1),
          padding: theme.spacing(2),
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottomColor: theme.palette.divider,
        }),
        head: ({ theme }) => ({
          color: theme.palette.primary.main,
        }),
      },
    },
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
