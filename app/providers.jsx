"use client";

import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';

const MuiProvider = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: mounted ? (resolvedTheme === 'dark' ? 'dark' : 'light') : 'light',
        primary: {
          main: '#667eea',
        },
        secondary: {
          main: '#764ba2',
        },
        background: {
          // Ensure MUI background matches our global Tailwind background to avoid white "boxes" in dark mode
          default: mounted && resolvedTheme === 'dark' ? '#030712' : '#f9fafb', // gray-950 : gray-50
          paper: mounted && resolvedTheme === 'dark' ? '#1f2937' : '#ffffff', // gray-800 : white
        }
      },
      typography: {
        fontFamily: 'var(--font-inter), sans-serif',
        allVariants: {
          fontFamily: 'var(--font-inter), sans-serif',
        },
        h1: { fontFamily: 'var(--font-outfit), sans-serif' },
        h2: { fontFamily: 'var(--font-outfit), sans-serif' },
        h3: { fontFamily: 'var(--font-outfit), sans-serif' },
        h4: { fontFamily: 'var(--font-outfit), sans-serif' },
        h5: { fontFamily: 'var(--font-outfit), sans-serif' },
        h6: { fontFamily: 'var(--font-outfit), sans-serif' },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: '8px',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none', // Remove MUI default overlay in dark mode for cleaner look
            }
          }
        }
      },
    });
  }, [resolvedTheme, mounted]);

  // Prevent hydration mismatch by rendering a consistent theme first or returning children plain (but that breaks styled components)
  // We handle 'mode' defaulting to 'light' initially via `mounted` check above.

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export function Providers({ children }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
      <MuiProvider>
        {children}
      </MuiProvider>
    </NextThemesProvider>
  );
}
