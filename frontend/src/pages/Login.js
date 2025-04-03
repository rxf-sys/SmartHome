import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Visibility, VisibilityOff, Email } from '@mui/icons-material';

const Login = () => {
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

  return (
    <Container component="main" maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ width: '100%', boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h4" gutterBottom>
              Smart Home Dashboard
            </Typography>
            <Typography component="h2" variant="h5" gutterBottom>
              Anmelden
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
                      <Email />
                    </InputAdornment>
                  ),
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
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      color="primary"
                    />
                  }
                  label="Angemeldet bleiben"
                />
                <Link href="#" variant="body2">
                  Passwort vergessen?
                </Link>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Anmelden'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  Noch kein Konto?{' '}
                  <Link component={RouterLink} to="/register" variant="body2">
                    Registrieren
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;