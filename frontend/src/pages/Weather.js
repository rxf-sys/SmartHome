import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import { getCurrentWeather, getWeatherForecast, updateDefaultLocation } from '../services/weatherService';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';

const Weather = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [savedLocation, setSavedLocation] = useState(false);

  // Aktuelles Wetter abrufen
  const { 
    data: currentWeather, 
    error: currentWeatherError, 
    isLoading: isCurrentWeatherLoading,
    refetch: refetchCurrentWeather
  } = useQuery(['currentWeather', selectedLocation], 
    () => getCurrentWeather(selectedLocation),
    {
      enabled: false, // Nicht automatisch abfragen - wir verwenden Mock-Daten
    }
  );

  // Wettervorhersage abrufen
  const { 
    data: forecastData, 
    error: forecastError, 
    isLoading: isForecastLoading,
    refetch: refetchForecast
  } = useQuery(['weatherForecast', selectedLocation], 
    () => getWeatherForecast(selectedLocation, 5),
    {
      enabled: false, // Nicht automatisch abfragen - wir verwenden Mock-Daten
    }
  );

  // Mock-Daten für das aktuelle Wetter
  const mockCurrentWeather = {
    location: 'Berlin',
    temperature: 22,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    uvIndex: 5,
    lastUpdate: new Date().toISOString()
  };

  // Mock-Daten für die Wettervorhersage
  const mockForecastData = {
    location: 'Berlin',
    forecast: Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      return {
        date: date.toISOString().split('T')[0],
        temperature: {
          min: 18 + Math.floor(Math.random() * 5),
          max: 25 + Math.floor(Math.random() * 5)
        },
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        humidity: 60 + Math.floor(Math.random() * 20),
        windSpeed: 10 + Math.floor(Math.random() * 10),
        precipitation: {
          probability: Math.floor(Math.random() * 100),
          amount: Math.random() * 10
        }
      };
    })
  };

  // Tatsächliche oder Mock-Daten verwenden
  const weatherData = currentWeather || mockCurrentWeather;
  const forecast = forecastData || mockForecastData;

  // Standort als Standard speichern
  const mutation = useMutation(updateDefaultLocation, {
    onSuccess: () => {
      setSavedLocation(true);
      setTimeout(() => setSavedLocation(false), 3000);
    }
  });

  const handleSaveLocation = () => {
    mutation.mutate(weatherData.location);
  };

  const handleSearch = () => {
    if (searchLocation.trim()) {
      setSelectedLocation(searchLocation);
      // Hier würden wir die Abfragen neu auslösen
      // refetchCurrentWeather();
      // refetchForecast();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Wetter-Icon basierend auf Bedingung
  const getWeatherIcon = (condition, size = 'large') => {
    condition = condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) {
      return <WbSunnyIcon fontSize={size} sx={{ color: '#FFD700' }} />;
    } else if (condition.includes('cloud') || condition.includes('partly')) {
      return <CloudIcon fontSize={size} sx={{ color: '#A9A9A9' }} />;
    } else if (
      condition.includes('rain') ||
      condition.includes('storm') ||
      condition.includes('thunder')
    ) {
      return <ThunderstormIcon fontSize={size} sx={{ color: '#4682B4' }} />;
    } else if (condition.includes('snow')) {
      return <AcUnitIcon fontSize={size} sx={{ color: '#ADD8E6' }} />;
    } else {
      return <CloudIcon fontSize={size} sx={{ color: '#A9A9A9' }} />;
    }
  };

  // Datum formatieren
  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom component="div">
        Wetter
      </Typography>

      {/* Suchfeld */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Standort suchen"
          variant="outlined"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <IconButton 
          color="primary" 
          sx={{ ml: 1 }} 
          onClick={handleSearch}
          aria-label="Suchen"
        >
          <SearchIcon />
        </IconButton>
      </Paper>

      {/* Aktuelles Wetter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography variant="h5">{weatherData.location}</Typography>
            </Box>
            <Button 
              variant="outlined" 
              startIcon={<LocationOnIcon />}
              onClick={handleSaveLocation}
              disabled={mutation.isLoading}
            >
              Als Standard speichern
            </Button>
          </Box>

          {savedLocation && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Standort wurde als Standard gespeichert!
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Box sx={{ fontSize: '5rem', height: '120px', display: 'flex', alignItems: 'center' }}>
                  {getWeatherIcon(weatherData.condition, 'inherit')}
                </Box>
                <Typography variant="h2" sx={{ mt: 2 }}>
                  {weatherData.temperature}°C
                </Typography>
                <Typography variant="h6">
                  {weatherData.condition}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText primary="Luftfeuchtigkeit" />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <OpacityIcon sx={{ mr: 1, color: '#4682B4' }} />
                    <Typography>{weatherData.humidity}%</Typography>
                  </Box>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Windgeschwindigkeit" />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AirIcon sx={{ mr: 1 }} />
                    <Typography>{weatherData.windSpeed} km/h</Typography>
                  </Box>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Luftdruck" />
                  <Typography>{weatherData.pressure} hPa</Typography>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="UV-Index" />
                  <Typography>{weatherData.uvIndex}</Typography>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Letztes Update" />
                  <Typography>
                    {new Date(weatherData.lastUpdate).toLocaleTimeString('de-DE')}
                  </Typography>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 5-Tage-Vorhersage */}
      <Typography variant="h5" gutterBottom component="div">
        5-Tage-Vorhersage
      </Typography>
      <Grid container spacing={2}>
        {forecast.forecast.map((day) => (
          <Grid item xs={12} sm={6} md={2.4} key={day.date}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {formatDate(day.date)}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {getWeatherIcon(day.condition)}
                </Box>
                <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
                  {day.condition}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Min</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {day.temperature.min}°C
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Max</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {day.temperature.max}°C
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <OpacityIcon fontSize="small" sx={{ mr: 0.5, color: '#4682B4' }} />
                    <Typography variant="body2">Regen</Typography>
                  </Box>
                  <Typography variant="body2">{day.precipitation.probability}%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AirIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">Wind</Typography>
                  </Box>
                  <Typography variant="body2">{day.windSpeed} km/h</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Weather;