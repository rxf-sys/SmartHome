import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  AccountCircle, 
  Email, 
  Lock, 
  ArrowForward, 
  ArrowBack 
} from '@mui/icons-material';

const Register = () => {
  const theme = useTheme();
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
  
  // Stepper status
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = 2;

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

  // Validiert nur das aktuelle Formular je nach Schritt
  const validateCurrentStep = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (activeStep === 0) {
      // Schritt 1: Name und Email validieren
      if (!formData.name.trim()) {
        errors.name = 'Name ist erforderlich';
      }
      
      if (!formData.email) {
        errors.email = 'E-Mail ist erforderlich';
      } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
      }
    } else if (activeStep === 1) {
      // Schritt 2: Passwörter validieren
      if (!formData.password) {
        errors.password = 'Passwort ist erforderlich';
      } else if (formData.password.length < 6) {
        errors.password = 'Passwort muss mindestens 6 Zeichen lang sein';
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Bitte bestätigen Sie Ihr Passwort';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwörter stimmen nicht überein';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Vollständiges Formular validieren
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

  // Zum nächsten Schritt
  const handleNext = () => {
    const isValid = validateCurrentStep();
    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Zum vorherigen Schritt
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
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

  // Formulare für jeden Schritt
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
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
                    <AccountCircle color="action" />
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                sx={{ 
                  px: 3, 
                  py: 1.2, 
                  borderRadius: 2,
                  background: `linear-gradient(90deg, #43cea2, #185a9d)`,
                  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Weiter
              </Button>
            </Box>
          </>
        );
      case 1:
        return (
          <>
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
                    <Lock color="action" />
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
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
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
                    <Lock color="action" />
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
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBack}
                startIcon={<ArrowBack />}
                sx={{ 
                  px: 3, 
                  py: 1.2, 
                  borderRadius: 2,
                }}
              >
                Zurück
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ 
                  px: 3, 
                  py: 1.2, 
                  borderRadius: 2,
                  background: `linear-gradient(90deg, #43cea2, #185a9d)`,
                  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrieren'}
              </Button>
            </Box>
          </>
        );
      default:
        return 'Unbekannter Schritt';
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)}, ${alpha(theme.palette.primary.light, 0.3)})`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative elements */}
      <Box 
        sx={{ 
          position: 'absolute',
          width: '50%',
          height: '140%',
          right: -100,
          top: -100,
          borderRadius: '50%',
          background: `linear-gradient(45deg, #43cea2, #185a9d)`,
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
          background: `linear-gradient(135deg, #43cea2, #185a9d)`,
          opacity: 0.5,
          transform: 'rotate(25deg)',
          zIndex: 0,
          filter: 'blur(60px)',
          display: { xs: 'none', md: 'block' }
        }}
      />
      
      <Container maxWidth="sm" sx={{ zIndex: 1, py: 20 }}>
        <Paper 
          elevation={10} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            backgroundColor: alpha('#00000', 0.9),
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                background: `linear-gradient(90deg, #43cea2, #185a9d)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Registrieren
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Erstellen Sie ein neues Konto für Ihr Smart Home
            </Typography>
          </Box>
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Persönliche Daten</StepLabel>
            </Step>
            <Step>
              <StepLabel>Sicherheit</StepLabel>
            </Step>
          </Stepper>
            
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
            
          <Box component="form" onSubmit={handleSubmit}>
            {getStepContent(activeStep)}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Bereits ein Konto?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/login" 
                    variant="body2" 
                    color="#43cea2" 
                    sx={{ fontWeight: 600, textDecoration: 'none' }}
                  >
                    Anmelden
                  </Link>
                </Typography>
              </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;