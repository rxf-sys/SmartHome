import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Grid,
  Stack,
  TextField, 
  IconButton, 
  Divider,
  Button,
  CircularProgress,
  Alert,
  Autocomplete,
  useTheme,
  alpha,
  Fade,
  Chip
} from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import { 
  getCurrentWeather, 
  getWeatherForecast, 
  searchLocations, 
  updateDefaultLocation 
} from '../services/weatherService';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import GrainIcon from '@mui/icons-material/Grain';
import SaveIcon from '@mui/icons-material/Save';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import RefreshIcon from '@mui/icons-material/Refresh';

// Wetter-Widget-Komponente importieren
import WeatherWidget from '../components/WeatherWidget';

const Weather = () => {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);
  const [savedLocation, setSavedLocation] = useState(false);
  const [geoPermissionDenied, setGeoPermissionDenied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Aktuelles Wetter abrufen
  const { 
    data: currentWeather, 
    error: currentWeatherError, 
    isLoading: isCurrentWeatherLoading,
    refetch: refetchCurrentWeather
  } = useQuery(
    ['currentWeather', selectedLocation], 
    () => getCurrentWeather(selectedLocation?.name),
    {
      enabled: selectedLocation !== null,
      staleTime: 600000, // Daten gelten für 10 Minuten als aktuell
    }
  );

  // Wettervorhersage abrufen
  const { 
    data: forecastData, 
    error: forecastError, 
    isLoading: isForecastLoading,
    refetch: refetchForecast
  } = useQuery(
    ['weatherForecast', selectedLocation], 
    () => getWeatherForecast(selectedLocation?.name, 5),
    {
      enabled: selectedLocation !== null,
      staleTime: 600000, // Daten gelten für 10 Minuten als aktuell
    }
  );

  // Standorte suchen
  const { 
    data: searchResults, 
    error: searchError, 
    isLoading: isSearchLoading,
    refetch: refetchSearch
  } = useQuery(
    ['locationSearch', searchQuery], 
    () => searchLocations(searchQuery),
    {
      enabled: searchQuery !== '',
      staleTime: 86400000, // Suchergebnisse gelten für einen Tag als aktuell
      onSuccess: (data) => {
        setLocationOptions(data || []);
      }
    }
  );

  // Standort als Standard speichern
  const mutation = useMutation(
    (location) => updateDefaultLocation(location.name, location.lat, location.lon),
    {
      onSuccess: () => {
        setSavedLocation(true);
        setTimeout(() => setSavedLocation(false), 3000);
      }
    }
  );

  // Aktualisieren aller Wetterdaten
  const handleRefreshAll = () => {
    setIsRefreshing(true);
    Promise.all([
      refetchCurrentWeather(),
      refetchForecast()
    ]).finally(() => {
      setTimeout(() => setIsRefreshing(false), 800);
    });
  };

  // Aktuelle Position verwenden
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Erfolgsfall
        (position) => {
          const { latitude, longitude } = position.coords;
          setGeoPermissionDenied(false);
          
          // Reverse Geocoding mit der OpenWeatherMap API
          // Wir verwenden nicht direkt die API, sondern senden die Koordinaten ans Backend
          const location = {
            name: 'Aktuelle Position',
            lat: latitude,
            lon: longitude
          };
          
          setSelectedLocation(location);
          
          // Wetterdaten mit Koordinaten abrufen
          refetchCurrentWeather();
          refetchForecast();
        },
        // Fehlerfall
        (error) => {
          console.error('Geolocation error:', error);
          if (error.code === error.PERMISSION_DENIED) {
            setGeoPermissionDenied(true);
          }
        }
      );
    }
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      setSearchQuery(searchValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLocationSelect = (event, newValue) => {
    if (newValue) {
      setSelectedLocation(newValue);
    }
  };

  const handleSaveLocation = () => {
    if (selectedLocation) {
      mutation.mutate(selectedLocation);
    }
  };

  // Bei der ersten Komponenten-Montage Wetterdaten ohne spezifischen Standort abrufen
  // Dies verwendet den Standard-/gespeicherten Standort des Benutzers
  useEffect(() => {
    const fetchInitialWeather = async () => {
      try {
        const data = await getCurrentWeather();
        // Standort aus den zurückgegebenen Daten extrahieren
        if (data && data.location) {
          setSelectedLocation({
            name: data.location,
            lat: data.lat || null,
            lon: data.lon || null,
            country: data.country || null
          });
        }
      } catch (error) {
        console.error('Fehler beim Abrufen des initialen Wetters:', error);
      }
    };
    
    fetchInitialWeather();
  }, []);

  // Wetter-Icon basierend auf Bedingung
  const getWeatherIcon = (condition, iconCode, size = 'medium') => {
    // Prüfen, ob es Tag oder Nacht ist (OpenWeatherMap verwendet 'd' für Tag und 'n' für Nacht)
    const isNight = iconCode && iconCode.endsWith('n');
    
    // Standardfarbe für das Icon
    let color = '#A9A9A9'; // Grau für den Fall, dass nichts passt
    
    // Bestimme das richtige Icon basierend auf der Wetterbedingung
    let Icon = CloudIcon;
    
    condition = condition ? condition.toLowerCase() : '';
    
    if (condition === 'clear') {
      Icon = isNight ? NightsStayIcon : WbSunnyIcon;
      color = isNight ? '#7986CB' : '#FFD700'; // Nacht: Indigo, Tag: Gold
    } else if (condition === 'clouds' || condition.includes('cloud')) {
      Icon = CloudIcon;
      color = '#78909C'; // Blaugrau
    } else if (
      condition === 'rain' || 
      condition.includes('rain') || 
      condition.includes('drizzle')
    ) {
      Icon = GrainIcon;
      color = '#4FC3F7'; // Hellblau
    } else if (
      condition === 'thunderstorm' || 
      condition.includes('storm') || 
      condition.includes('thunder')
    ) {
      Icon = ThunderstormIcon;
      color = '#5C6BC0'; // Indigo
    } else if (
      condition === 'snow' || 
      condition.includes('snow')
    ) {
      Icon = AcUnitIcon;
      color = '#B3E5FC'; // Sehr helles Blau
    }
    
    return <Icon fontSize={size} sx={{ color }} />;
  };

  // Datum formatieren
  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  // Temperaturbereich für Vorhersage formatieren
  const formatTempRange = (min, max) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.primary.main }}>
          <ThermostatIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {max}°
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
          /
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {min}°
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3
      }}>
        <Typography variant="h4" component="h1">
          Wetter
        </Typography>
        <IconButton 
          color="primary"
          onClick={handleRefreshAll}
          disabled={isRefreshing || isCurrentWeatherLoading || isForecastLoading}
        >
          <RefreshIcon sx={{ 
            animation: isRefreshing ? 'spin 1s linear infinite' : 'none' 
          }} />
        </IconButton>
      </Box>

      {/* Suchfeld */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          background: `linear-gradient(to right, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Autocomplete
            fullWidth
            options={locationOptions}
            getOptionLabel={(option) => `${option.name}${option.country ? `, ${option.country}` : ''}`}
            inputValue={searchValue}
            onInputChange={(event, newValue) => setSearchValue(newValue)}
            onChange={handleLocationSelect}
            loading={isSearchLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Standort suchen"
                variant="outlined"
                onKeyPress={handleKeyPress}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'action.active', mr: 1 }}>
                      <LocationOnIcon />
                    </Box>
                  ),
                  endAdornment: (
                    <>
                      {isSearchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{ flex: 3 }}
          />
          
          <Button 
            variant="contained" 
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={!searchValue.trim()}
            sx={{ 
              flex: 0.8,
              height: { xs: 'auto', md: 56 },
              borderRadius: 2
            }}
          >
            Suchen
          </Button>
          
          <Button 
            variant="outlined" 
            color="secondary"
            startIcon={<MyLocationIcon />}
            onClick={handleUseCurrentLocation}
            sx={{ 
              flex: 1.2,
              height: { xs: 'auto', md: 56 },
              borderRadius: 2
            }}
          >
            Aktuelle Position
          </Button>
          
          {selectedLocation && (
            <Button 
              variant="contained" 
              color="success"
              startIcon={<SaveIcon />}
              onClick={handleSaveLocation}
              disabled={mutation.isLoading}
              sx={{ 
                flex: 1,
                height: { xs: 'auto', md: 56 },
                borderRadius: 2
              }}
            >
              Als Standard
            </Button>
          )}
        </Stack>
        
        {geoPermissionDenied && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Standortzugriff verweigert. Bitte aktivieren Sie den Standortzugriff in Ihren Browsereinstellungen.
          </Alert>
        )}
        
        {savedLocation && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Standort wurde als Standard gespeichert!
          </Alert>
        )}
        
        {searchError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Fehler bei der Standortsuche: {searchError.message}
          </Alert>
        )}
      </Paper>

      {/* Hauptbereich mit aktuellem Wetter und Vorhersage */}
      <Grid container spacing={4}>
        {/* Aktuelles Wetter */}
        <Grid item xs={12} md={5}>
          <Fade in={!isCurrentWeatherLoading} timeout={800}>
            <Box>
              {isCurrentWeatherLoading ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  minHeight: 300
                }}>
                  <CircularProgress />
                </Box>
              ) : currentWeatherError ? (
                <Alert 
                  severity="error"
                  sx={{ borderRadius: 2, boxShadow: 2 }}
                >
                  Fehler beim Laden der Wetterdaten: {currentWeatherError.message}
                </Alert>
              ) : currentWeather ? (
                <WeatherWidget />
              ) : (
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`
                  }}
                >
                  <WbSunnyIcon fontSize="large" sx={{ color: alpha(theme.palette.warning.main, 0.7), mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Wetterdaten
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Bitte wählen Sie einen Standort, um Wetterdaten anzuzeigen.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<MyLocationIcon />}
                    onClick={handleUseCurrentLocation}
                  >
                    Aktuelle Position verwenden
                  </Button>
                </Paper>
              )}
            </Box>
          </Fade>
        </Grid>

        {/* Wettervorhersage */}
        <Grid item xs={12} md={7}>
          <Fade in={!isForecastLoading} timeout={800}>
            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                5-Tage-Vorhersage
              </Typography>
              
              {isForecastLoading ? (
                <Stack spacing={2}>
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Skeleton key={index} height={90} />
                  ))}
                </Stack>
              ) : forecastError ? (
                <Alert 
                  severity="error"
                  sx={{ borderRadius: 2, boxShadow: 2 }}
                >
                  Fehler beim Laden der Vorhersage: {forecastError.message}
                </Alert>
              ) : forecastData && forecastData.forecast ? (
                <Stack spacing={2}>
                  {forecastData.forecast.map((day) => (
                    <Card 
                      key={day.date} 
                      elevation={2}
                      sx={{ 
                        borderRadius: 3,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: 4,
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Grid container alignItems="center" spacing={1}>
                          {/* Tag */}
                          <Grid item xs={12} sm={3}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {formatDate(day.date).split(',')[0]}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(day.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric' })}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          {/* Wetter-Icon */}
                          <Grid item xs={3} sm={2} sx={{ textAlign: 'center' }}>
                            {getWeatherIcon(day.condition, day.icon)}
                          </Grid>
                          
                          {/* Beschreibung */}
                          <Grid item xs={9} sm={3}>
                            <Typography variant="body1">
                              {day.description 
                                ? day.description.charAt(0).toUpperCase() + day.description.slice(1)
                                : day.condition}
                            </Typography>
                          </Grid>
                          
                          {/* Details */}
                          <Grid item xs={6} sm={2}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <OpacityIcon sx={{ color: '#4682B4', fontSize: 18 }} />
                              <Typography variant="body2">
                                {day.precipitation?.probability || 0}%
                              </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                              <AirIcon sx={{ fontSize: 18 }} />
                              <Typography variant="body2">
                                {day.windSpeed} km/h
                              </Typography>
                            </Stack>
                          </Grid>
                          
                          {/* Temperatur */}
                          <Grid item xs={6} sm={2} sx={{ textAlign: 'right' }}>
                            {formatTempRange(day.temperature.min, day.temperature.max)}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Keine Vorhersagedaten verfügbar
                  </Typography>
                  <Typography variant="body1">
                    Bitte wählen Sie einen Standort, um die Wettervorhersage anzuzeigen.
                  </Typography>
                </Paper>
              )}
            </Box>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

// Skeleton-Komponente für Ladeanzeige
const Skeleton = ({ height = 100 }) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        height, 
        borderRadius: 3, 
        animation: 'pulse 1.5s ease-in-out infinite',
        bgcolor: alpha(theme.palette.text.disabled, 0.1),
      }} 
    />
  );
};

// CSS für die Animationen
const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 0.3; }
    100% { opacity: 0.6; }
  }
`;
document.head.appendChild(style);

export default Weather;