import React, { useState, useMemo, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// Context
import { AuthProvider } from './context/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Weather from './pages/Weather';
import Banking from './pages/Banking';
import SmartThings from './pages/SmartThings';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Create a color mode context
export const ColorModeContext = createContext({ 
  toggleColorMode: () => {},
  mode: 'light'
});

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 300000, // 5 minutes
    },
  },
});

// Import Google Fonts
const Fonts = () => {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    `}</style>
  );
};

function App() {
  // State für den Farbmodus (light/dark)
  const [mode, setMode] = useState('light');

  // Kontext für Farbmoduswechsel
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode],
  );

  // Erzeugt das Theme basierend auf dem aktuellen Farbmodus
  const theme = useMemo(() => {
    let theme = createTheme({
      palette: {
        mode,
        ...(mode === 'light'
          ? {
              // Light mode colors
              primary: {
                main: '#3a7bd5',
                light: '#6fa8ff',
                dark: '#0052a3',
                contrastText: '#ffffff',
              },
              secondary: {
                main: '#f77062',
                light: '#ff9f90',
                dark: '#bd4337',
                contrastText: '#ffffff',
              },
              background: {
                default: '#f8f9fa',
                paper: '#ffffff',
              },
              text: {
                primary: '#24292e',
                secondary: '#586069',
              },
            }
          : {
              // Dark mode colors
              primary: {
                main: '#3a7bd5',
                light: '#6fa8ff',
                dark: '#0052a3',
                contrastText: '#ffffff',
              },
              secondary: {
                main: '#f77062',
                light: '#ff9f90',
                dark: '#bd4337',
                contrastText: '#ffffff',
              },
              background: {
                default: '#121212',
                paper: '#1e1e1e',
              },
              text: {
                primary: '#e1e1e1',
                secondary: '#aaaaaa',
              },
            }),
      },
      typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontWeight: 700,
        },
        h2: {
          fontWeight: 700,
        },
        h3: {
          fontWeight: 600,
        },
        h4: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 600,
        },
        h6: {
          fontWeight: 600,
        },
        subtitle1: {
          fontWeight: 500,
        },
        subtitle2: {
          fontWeight: 500,
        },
        button: {
          fontWeight: 600,
          textTransform: 'none',
        },
      },
      shape: {
        borderRadius: 10,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              padding: '10px 24px',
              boxShadow: 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
              },
            },
            containedPrimary: {
              background: 'linear-gradient(45deg, #3a7bd5, #00d2ff)',
            },
            containedSecondary: {
              background: 'linear-gradient(45deg, #f77062, #fe5196)',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              },
            },
          },
        },
        MuiCardContent: {
          styleOverrides: {
            root: {
              padding: 24,
              '&:last-child': {
                paddingBottom: 24,
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            rounded: {
              borderRadius: 16,
            },
            elevation1: {
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
            },
            elevation2: {
              boxShadow: '0 3px 15px rgba(0, 0, 0, 0.07)',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              fontWeight: 500,
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
              color: mode === 'light' ? '#24292e' : '#e1e1e1',
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
              backgroundImage: mode === 'light' 
                ? 'linear-gradient(rgba(58, 123, 213, 0.05), rgba(0, 210, 255, 0.05))'
                : 'none',
              borderRight: 'none',
              boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              margin: '4px 8px',
              '&.Mui-selected': {
                backgroundColor: mode === 'light' 
                  ? 'rgba(58, 123, 213, 0.1)' 
                  : 'rgba(58, 123, 213, 0.2)',
                '&:hover': {
                  backgroundColor: mode === 'light' 
                    ? 'rgba(58, 123, 213, 0.15)' 
                    : 'rgba(58, 123, 213, 0.25)',
                },
              },
              '&:hover': {
                backgroundColor: mode === 'light' 
                  ? 'rgba(0, 0, 0, 0.03)' 
                  : 'rgba(255, 255, 255, 0.05)',
              },
            },
          },
        },
        MuiAvatar: {
          styleOverrides: {
            root: {
              background: 'linear-gradient(45deg, #3a7bd5, #00d2ff)',
            },
          },
        },
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              backgroundColor: mode === 'light' 
                ? 'rgba(36, 41, 46, 0.9)' 
                : 'rgba(200, 200, 200, 0.9)',
              color: mode === 'light' ? '#fff' : '#000',
              borderRadius: 6,
              fontSize: '0.75rem',
            },
          },
        },
      },
    });

    // Make typography responsive
    theme = responsiveFontSizes(theme);
    return theme;
  }, [mode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Fonts />
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <PrivateRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/weather" element={
                  <PrivateRoute>
                    <Layout>
                      <Weather />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/banking" element={
                  <PrivateRoute>
                    <Layout>
                      <Banking />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/smartthings" element={
                  <PrivateRoute>
                    <Layout>
                      <SmartThings />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/settings" element={
                  <PrivateRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}

export default App;