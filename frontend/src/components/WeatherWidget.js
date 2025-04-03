import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  Tooltip,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import { useQuery } from 'react-query';
import { getCurrentWeather } from '../services/weatherService';

// Icons
import CloudIcon from '@mui/icons-material/Cloud';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import GrainIcon from '@mui/icons-material/Grain';
import WaterIcon from '@mui/icons-material/Water';
import AirIcon from '@mui/icons-material/Air';
import CompressIcon from '@mui/icons-material/Compress';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import LightModeIcon from '@mui/icons-material/LightMode';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import MistIcon from '@mui/icons-material/BlurOn';

const WeatherWidget = ({ compact = false, location = null }) => {
  const theme = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Aktuelle Wetterdaten abrufen
  const { 
    data, 
    error, 
    isLoading, 
    refetch 
  } = useQuery(['currentWeather', location], () => getCurrentWeather(location), {
    refetchInterval: 1800000, // alle 30 Minuten aktualisieren
    staleTime: 600000, // Daten gelten für 10 Minuten als aktuell
  });

  // Wetter-Icon basierend auf Bedingung und Icon-Code zurückgeben
  const getWeatherIcon = (condition, iconCode, size = 'large') => {
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
    } else if (
      condition === 'mist' || 
      condition.includes('fog') || 
      condition.includes('haze')
    ) {
      Icon = MistIcon;
      color = '#B0BEC5'; // Blaugrau, etwas heller
    }
    
    return <Icon fontSize={size} sx={{ color }} />;
  };

  // Zeit formatieren
  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    
    try {
      const options = { hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleTimeString('de-DE', options);
    } catch (e) {
      console.error('Error formatting time:', e);
      return '--:--';
    }
  };

  // Manuelles Aktualisieren der Wetterdaten
  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch().then(() => {
      setTimeout(() => setIsRefreshing(false), 500);
    });
  };

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Typography color="error">
      Fehler beim Laden der Wetterdaten: {error.message}
    </Typography>
  );

  // Wenn keine Daten vorhanden sind
  if (!data) return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="body1" color="text.secondary">
        Keine Wetterdaten verfügbar
      </Typography>
      <IconButton onClick={handleRefresh} sx={{ mt: 1 }}>
        <RefreshIcon />
      </IconButton>
    </Box>
  );

  const weatherData = data;

  // Kompaktes Widget für Dashboard
  if (compact) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div">
            Wetter
          </Typography>
          <Tooltip title="Aktualisieren">
            <IconButton size="small" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshIcon fontSize="small" sx={{
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
              }} />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body1">{weatherData.location}</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {weatherData.temperature}°C
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gefühlt wie {weatherData.feelsLike}°C
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                {getWeatherIcon(weatherData.condition, weatherData.icon, 'large')}
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {weatherData.description ? 
                    weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1) : 
                    weatherData.condition}
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={1} sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <WaterIcon fontSize="small" sx={{ color: '#4682B4' }} />
                  <Typography variant="body2">{weatherData.humidity}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <AirIcon fontSize="small" />
                  <Typography variant="body2">{weatherData.windSpeed} km/h</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <CompressIcon fontSize="small" />
                  <Typography variant="body2">{weatherData.pressure} hPa</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Ausführliche Ansicht für die Wetterseite
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div">
          Aktuelles Wetter
        </Typography>
        <Tooltip title="Aktualisieren">
          <IconButton onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshIcon sx={{
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
            }} />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5">
                  {weatherData.location}{weatherData.country ? `, ${weatherData.country}` : ''}
                </Typography>
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                {weatherData.temperature}°C
              </Typography>
              <Chip 
                label={`Gefühlt wie ${weatherData.feelsLike}°C`} 
                size="small" 
                variant="outlined" 
                sx={{ mb: 1 }}
              />
              <Typography variant="body1">
                {weatherData.description ? 
                  weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1) : 
                  weatherData.condition}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              {getWeatherIcon(weatherData.condition, weatherData.icon, 'large')}
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Min: {weatherData.tempMin}°C / Max: {weatherData.tempMax}°C
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), boxShadow: 1 }}>
                <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WaterIcon sx={{ color: '#4682B4', mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Luftfeuchtigkeit
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {weatherData.humidity}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), boxShadow: 1 }}>
                <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AirIcon sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Wind
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {weatherData.windSpeed} km/h
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), boxShadow: 1 }}>
                <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CompressIcon sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Luftdruck
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {weatherData.pressure} hPa
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), boxShadow: 1 }}>
                <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <VisibilityIcon sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Sichtweite
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {weatherData.visibility || 10} km
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {weatherData.sunrise && weatherData.sunset && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 3, 
              bgcolor: alpha(theme.palette.primary.main, 0.05), 
              p: 2, 
              borderRadius: '8px',
              boxShadow: 1
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <WbSunnyIcon sx={{ color: 'warning.main' }} />
                <Typography variant="body2" color="text.secondary">Sonnenaufgang</Typography>
                <Typography variant="body1">{formatTime(weatherData.sunrise)}</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <NightsStayIcon sx={{ color: 'info.main' }} />
                <Typography variant="body2" color="text.secondary">Sonnenuntergang</Typography>
                <Typography variant="body1">{formatTime(weatherData.sunset)}</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <AirIcon />
                <Typography variant="body2" color="text.secondary">Windrichtung</Typography>
                <Typography variant="body1">{weatherData.windDirection || 'SW'}</Typography>
              </Box>
            </Box>
          )}
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 2 }}>
            Letztes Update: {new Date(weatherData.lastUpdate).toLocaleTimeString('de-DE')}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

// CSS für die Drehanimation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default WeatherWidget;