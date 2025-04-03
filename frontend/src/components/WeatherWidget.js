import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent } from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';
import CloudIcon from '@mui/icons-material/Cloud';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';

const fetchWeatherData = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/weather`);
  return response.data;
};

const WeatherWidget = () => {
  const { data, error, isLoading } = useQuery('weatherData', fetchWeatherData, {
    refetchInterval: 1800000, // refetch every 30 minutes
    enabled: false, // Disable automatic fetching initially
  });

  // Mock data for development until API is connected
  const [mockData] = useState({
    temperature: 22,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12,
    location: 'Berlin',
  });

  // Use mock data or API data
  const weatherData = data || mockData;

  const getWeatherIcon = (condition) => {
    condition = condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) {
      return <WbSunnyIcon fontSize="large" sx={{ color: '#FFD700' }} />;
    } else if (condition.includes('cloud')) {
      return <CloudIcon fontSize="large" sx={{ color: '#A9A9A9' }} />;
    } else if (
      condition.includes('rain') ||
      condition.includes('storm') ||
      condition.includes('thunder')
    ) {
      return <ThunderstormIcon fontSize="large" sx={{ color: '#4682B4' }} />;
    } else if (condition.includes('snow')) {
      return <AcUnitIcon fontSize="large" sx={{ color: '#ADD8E6' }} />;
    } else {
      return <CloudIcon fontSize="large" sx={{ color: '#A9A9A9' }} />;
    }
  };

  if (isLoading) return <CircularProgress />;

  if (error)
    return (
      <Typography color="error">
        Fehler beim Laden der Wetterdaten: {error.message}
      </Typography>
    );

  return (
    <Box>
      <Typography variant="h6" component="div" gutterBottom>
        Wetter
      </Typography>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h4">{weatherData.temperature}°C</Typography>
              <Typography variant="body1">{weatherData.location}</Typography>
              <Typography variant="body2" color="text.secondary">
                Luftfeuchtigkeit: {weatherData.humidity}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Wind: {weatherData.windSpeed} km/h
              </Typography>
            </Box>
            <Box>{getWeatherIcon(weatherData.condition)}</Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WeatherWidget;