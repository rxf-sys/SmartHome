import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ColorModeContext } from '../App';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  useTheme,
  alpha,
  Alert,
  Tooltip
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  LightMode, 
  NightsStay 
} from '@mui/icons-material';

const Login = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const { login, error, clearError, user, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Wenn User bereits eingeloggt ist, zum Dashboard weiterleiten
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Feldvalidierungsfehler löschen
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: '',
      });
    }
    
    // Globale Fehler bei Eingabeänderung löschen
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email) {
      errors.email = 'Email ist erforderlich';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Bitte geben Sie eine gültige Email-Adresse ein';
    }
    
    if (!formData.password) {
      errors.password = 'Passwort ist erforderlich';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const success = await login(formData);
    if (success) {
      navigate('/');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const bgGradient = theme.palette.mode === 'light'
    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.primary.dark, 0.3)})`
    : `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)}, ${alpha('#000', 0.5)})`;

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        background: bgGradient,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Theme toggle button in corner */}
      <Tooltip title={`Zum ${theme.palette.mode === 'light' ? 'Dunklen' : 'Hellen'} Modus wechseln`}>
        <IconButton 
          onClick={colorMode.toggleColorMode}
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: alpha(theme.palette.background.paper, 0.95),
            }
          }}
        >
          {theme.palette.mode === 'dark' ? <LightMode /> : <NightsStay />}
        </IconButton>
      </Tooltip>
      
      {/* Decorative elements */}
      <Box 
        sx={{ 
          position: 'absolute',
          width: '50%',
          height: '140%',
          right: -100,
          top: -100,
          borderRadius: '50%',
          background: theme.palette.mode === 'light'
            ? `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`
            : `linear-gradient(45deg, ${alpha(theme.palette.secondary.main, 0.3)}, ${alpha(theme.palette.primary.main, 0.3)})`,
          transform: 'rotate(-10deg)',
          zIndex: 0,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          display: { xs: 'none', md: 'block' }
        }}
      />
      
      <Box 
        sx={{ 
          position: 'absolute',
          width: '40%',
          height: '50%',
          right: '10%',
          bottom: -100,
          borderRadius: '60% 70% 50% 40%',
          background: theme.palette.mode === 'light'
            ? `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.secondary.light})`
            : `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.3)}, ${alpha(theme.palette.secondary.light, 0.3)})`,
          opacity: theme.palette.mode === 'light' ? 0.5 : 0.2,
          transform: 'rotate(25deg)',
          zIndex: 0,
          filter: 'blur(60px)',
          display: { xs: 'none', md: 'block' }
        }}
      />
      
      <Container maxWidth="sm" sx={{ zIndex: 1, py: 8, display: 'flex', alignItems: 'center' }}>
        <Paper 
          elevation={10} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'light' ? 0.9 : 0.8),
            boxShadow: theme.palette.mode === 'light'
              ? '0 8px 32px rgba(0, 0, 0, 0.1)'
              : '0 8px 32px rgba(0, 0, 0, 0.3)',
            width: '100%'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Willkommen zurück
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Geben Sie Ihre Anmeldedaten ein, um fortzufahren
            </Typography>
          </Box>
            
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
            
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Passwort"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography variant="body2">Angemeldet bleiben</Typography>}
              />
              <Link href="#" variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                Passwort vergessen?
              </Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 2, 
                mb: 3, 
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                  transform: 'translateY(-2px)'
                }
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'ANMELDEN'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Noch kein Konto?{' '}
                <Link component={RouterLink} to="/register" variant="body2" color="secondary" sx={{ fontWeight: 600, textDecoration: 'none' }}>
                  Registrieren
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;