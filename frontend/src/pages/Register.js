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
  Divider
} from '@mui/material';
import { Visibility, VisibilityOff, AccountCircle, Email, Lock } from '@mui/icons-material';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, error, clearError, user, loading } = useContext(AuthContext);
  
  // Formular-State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // Formularfehler
  const [formErrors, setFormErrors] = useState({});
  
  // Passwort-Sichtbarkeit
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  // Wenn Benutzer bereits angemeldet ist, zum Dashboard weiterleiten
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Formular-Eingaben aktualisieren
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Feldvalidierungsfehler löschen
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Globale Fehler bei Eingabeänderung löschen
    if (error) {
      clearError();
    }
  };

  // Passwort-Sichtbarkeit umschalten
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Formular validieren
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Name validieren
    if (!formData.name.trim()) {
      errors.name = 'Name ist erforderlich';
    }
    
    // E-Mail validieren
    if (!formData.email) {
      errors.email = 'E-Mail ist erforderlich';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }
    
    // Passwort validieren
    if (!formData.password) {
      errors.password = 'Passwort ist erforderlich';
    } else if (formData.password.length < 6) {
      errors.password = 'Passwort muss mindestens 6 Zeichen lang sein';
    }
    
    // Passwortbestätigung validieren
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Bitte bestätigen Sie Ihr Passwort';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwörter stimmen nicht überein';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Formular absenden
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Entferne confirmPassword aus den Daten, die an den Server gesendet werden
    const { confirmPassword, ...registrationData } = formData;
    
    const success = await registerUser(registrationData);
    if (success) {
      navigate('/');
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ width: '100%', boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Header */}
            <Typography component="h1" variant="h4" gutterBottom>
              Smart Home Dashboard
            </Typography>
            <Typography component="h2" variant="h5" gutterBottom>
              Registrieren
            </Typography>
            <Divider sx={{ width: '100%', mb: 3, mt: 1 }} />
            
            {/* Fehleranzeige */}
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {/* Registrierungsformular */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              {/* Name */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
              
              {/* E-Mail */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="E-Mail"
                name="email"
                autoComplete="email"
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
              
              {/* Passwort */}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Passwort"
                type={showPassword.password ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Passwort-Sichtbarkeit umschalten"
                        onClick={() => togglePasswordVisibility('password')}
                        edge="end"
                      >
                        {showPassword.password ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              {/* Passwort bestätigen */}
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Passwort bestätigen"
                type={showPassword.confirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Passwortbestätigungs-Sichtbarkeit umschalten"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        edge="end"
                      >
                        {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              {/* Registrierungsbutton */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Registrieren'
                )}
              </Button>
              
              {/* Link zur Anmeldung */}
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2">
                  Bereits ein Konto?{' '}
                  <Link component={RouterLink} to="/login" variant="body2">
                    Anmelden
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

export default Register;