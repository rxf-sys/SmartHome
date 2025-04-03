import React from 'react';
import { Box, Typography, Button, Container, Paper, useTheme, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.dark, 0.2)})`,
        position: 'relative',
        overflow: 'hidden',
        p: 3
      }}
    >
      {/* Decorative elements */}
      <Box 
        sx={{ 
          position: 'absolute',
          width: '300px',
          height: '300px',
          right: -50,
          top: -50,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      
      <Box 
        sx={{ 
          position: 'absolute',
          width: '250px',
          height: '250px',
          left: -50,
          bottom: -50,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})`,
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      
      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        <Paper 
          elevation={6} 
          sx={{ 
            p: 5, 
            textAlign: 'center', 
            borderRadius: 4,
            backdropFilter: 'blur(8px)',
            backgroundColor: alpha('#ffffff', 0.9),
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box 
            sx={{ 
              mb: 3, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
            }}
          >
            <ErrorOutlineIcon 
              sx={{ 
                fontSize: 100, 
                color: alpha(theme.palette.error.main, 0.7),
                filter: `drop-shadow(0 4px 8px ${alpha(theme.palette.error.main, 0.4)})`,
              }} 
            />
          </Box>
          
          <Typography 
            variant="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.primary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            404
          </Typography>
          
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Seite nicht gefunden
          </Typography>
          
          <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 4 }}>
            Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
            Bitte überprüfen Sie die URL oder kehren Sie zur Startseite zurück.
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              px: 4, 
              py: 1.5,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              borderRadius: 3,
              boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                transform: 'translateY(-2px)'
              }
            }}
          >
            Zurück zur Startseite
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound;