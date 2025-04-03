import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';

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

// Create a client for React Query
const queryClient = new QueryClient();

// Create a theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
    </QueryClientProvider>
  );
}

export default App;