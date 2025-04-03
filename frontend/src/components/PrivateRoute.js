import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * Komponente für geschützte Routen - leitet nicht authentifizierte Benutzer zum Login um
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Zeige Ladeindikator während Authentifizierungsstatus überprüft wird
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Wenn kein Benutzer eingeloggt ist, zum Login umleiten
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Andernfalls die geschützte Komponente anzeigen
  return children;
};

export default PrivateRoute;