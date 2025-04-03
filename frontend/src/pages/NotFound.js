import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        
        <Typography variant="h4" gutterBottom>
          404 - Seite nicht gefunden
        </Typography>
        
        <Typography variant="body1" paragraph color="text.secondary">
          Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Zurück zur Startseite
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFound;