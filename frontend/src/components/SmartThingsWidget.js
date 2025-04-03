import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, Grid, Switch, Slider, FormControlLabel } from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

// Icons
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import SecurityIcon from '@mui/icons-material/Security';

const fetchSmartThingsDevices = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/smartthings/devices`);
  return response.data;
};

const controlDevice = async ({ deviceId, command, value }) => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/smartthings/devices/${deviceId}/control`, {
    command,
    value
  });
  return response.data;
};

const SmartThingsWidget = () => {
  const { data, error, isLoading, refetch } = useQuery('smartThingsDevices', fetchSmartThingsDevices, {
    refetchInterval: 30000, // refetch every 30 seconds
    enabled: false, // Disable automatic fetching initially
  });

  // Mock data for development until API is connected
  const [mockData] = useState({
    devices: [
      {
        id: 'd1',
        name: 'Wohnzimmer Licht',
        type: 'light',
        status: {
          power: 'on',
          brightness: 80
        }
      },
      {
        id: 'd2',
        name: 'Heizung',
        type: 'thermostat',
        status: {
          power: 'on',
          temperature: 21.5
        }
      },
      {
        id: 'd3',
        name: 'Haustür',
        type: 'door',
        status: {
          state: 'closed'
        }
      },
      {
        id: 'd4',
        name: 'Alarm',
        type: 'security',
        status: {
          state: 'disarmed'
        }
      }
    ]
  });

  // Use mock data or API data
  const smartThingsData = data || mockData;

  // Setup mutation
  const mutation = useMutation(controlDevice, {
    onSuccess: () => {
      // Refetch the devices to update the UI
      refetch();
    }
  });

  // Handle device controls
  const handleDeviceToggle = (device) => (event) => {
    const newPowerState = event.target.checked ? 'on' : 'off';
    
    // Update local state immediately for responsive UI
    const updatedDevices = smartThingsData.devices.map(d => {
      if (d.id === device.id) {
        return {
          ...d,
          status: {
            ...d.status,
            power: newPowerState
          }
        };
      }
      return d;
    });
    
    // Call API
    mutation.mutate({
      deviceId: device.id,
      command: 'setPower',
      value: newPowerState
    });
  };

  const handleBrightnessChange = (device) => (event, newValue) => {
    // Update local state immediately
    const updatedDevices = smartThingsData.devices.map(d => {
      if (d.id === device.id) {
        return {
          ...d,
          status: {
            ...d.status,
            brightness: newValue
          }
        };
      }
      return d;
    });
    
    // Call API (we can debounce this for sliders)
    mutation.mutate({
      deviceId: device.id,
      command: 'setBrightness',
      value: newValue
    });
  };

  const handleTemperatureChange = (device) => (event, newValue) => {
    // Update local state immediately
    const updatedDevices = smartThingsData.devices.map(d => {
      if (d.id === device.id) {
        return {
          ...d,
          status: {
            ...d.status,
            temperature: newValue
          }
        };
      }
      return d;
    });
    
    // Call API (we can debounce this for sliders)
    mutation.mutate({
      deviceId: device.id,
      command: 'setTemperature',
      value: newValue
    });
  };

  // Get icon by device type
  const getDeviceIcon = (type) => {
    switch(type) {
      case 'light':
        return <LightbulbIcon fontSize="large" sx={{ color: '#FFD700' }} />;
      case 'thermostat':
        return <ThermostatIcon fontSize="large" sx={{ color: '#FF6347' }} />;
      case 'door':
        return <DoorFrontIcon fontSize="large" sx={{ color: '#8B4513' }} />;
      case 'security':
        return <SecurityIcon fontSize="large" sx={{ color: '#4682B4' }} />;
      default:
        return <LightbulbIcon fontSize="large" />;
    }
  };

  // Render different controls based on device type
  const renderDeviceControls = (device) => {
    switch(device.type) {
      case 'light':
        return (
          <>
            <FormControlLabel
              control={
                <Switch
                  checked={device.status.power === 'on'}
                  onChange={handleDeviceToggle(device)}
                />
              }
              label={device.status.power === 'on' ? 'An' : 'Aus'}
            />
            {device.status.power === 'on' && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="body2" id={`brightness-slider-${device.id}`}>
                  Helligkeit: {device.status.brightness}%
                </Typography>
                <Slider
                  value={device.status.brightness}
                  onChange={handleBrightnessChange(device)}
                  aria-labelledby={`brightness-slider-${device.id}`}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={5}
                  max={100}
                />
              </Box>
            )}
          </>
        );
      case 'thermostat':
        return (
          <>
            <FormControlLabel
              control={
                <Switch
                  checked={device.status.power === 'on'}
                  onChange={handleDeviceToggle(device)}
                />
              }
              label={device.status.power === 'on' ? 'An' : 'Aus'}
            />
            {device.status.power === 'on' && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="body2" id={`temperature-slider-${device.id}`}>
                  Temperatur: {device.status.temperature}°C
                </Typography>
                <Slider
                  value={device.status.temperature}
                  onChange={handleTemperatureChange(device)}
                  aria-labelledby={`temperature-slider-${device.id}`}
                  valueLabelDisplay="auto"
                  step={0.5}
                  marks
                  min={16}
                  max={28}
                />
              </Box>
            )}
          </>
        );
      case 'door':
        return (
          <Typography variant="body1">
            Status: {device.status.state === 'closed' ? 'Geschlossen' : 'Geöffnet'}
          </Typography>
        );
      case 'security':
        return (
          <Typography variant="body1">
            Status: {device.status.state === 'armed' ? 'Aktiviert' : 'Deaktiviert'}
          </Typography>
        );
      default:
        return null;
    }
  };

  if (isLoading) return <CircularProgress />;

  if (error)
    return (
      <Typography color="error">
        Fehler beim Laden der SmartThings-Geräte: {error.message}
      </Typography>
    );

  return (
    <Box>
      <Typography variant="h6" component="div" gutterBottom>
        Smart Home
      </Typography>
      
      <Grid container spacing={2}>
        {smartThingsData.devices.map((device) => (
          <Grid item xs={12} key={device.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2 }}>
                    {getDeviceIcon(device.type)}
                  </Box>
                  <Typography variant="subtitle1">
                    {device.name}
                  </Typography>
                </Box>
                {renderDeviceControls(device)}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SmartThingsWidget;