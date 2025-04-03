import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Tabs, 
  Tab, 
  Switch, 
  Slider, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControlLabel,
  IconButton
} from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import { getDevices, controlDevice } from '../services/smartThingsService';
import AddIcon from '@mui/icons-material/Add';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import RoomIcon from '@mui/icons-material/Room';
import DevicesIcon from '@mui/icons-material/Devices';
import AutomationIcon from '@mui/icons-material/AutoFixHigh';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const SmartThings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [openDeviceDialog, setOpenDeviceDialog] = useState(false);
  const [openRuleDialog, setOpenRuleDialog] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  // Mock-Räume
  const rooms = [
    { id: 'all', name: 'Alle Räume' },
    { id: 'livingroom', name: 'Wohnzimmer' },
    { id: 'kitchen', name: 'Küche' },
    { id: 'bedroom', name: 'Schlafzimmer' },
    { id: 'bathroom', name: 'Badezimmer' },
    { id: 'entrance', name: 'Eingangsbereich' }
  ];

  // Geräte abrufen
  const { 
    data: devicesData, 
    error: devicesError, 
    isLoading: isDevicesLoading,
    refetch: refetchDevices
  } = useQuery('smartThingsDevices', getDevices, {
    enabled: false, // Nicht automatisch abfragen - wir verwenden Mock-Daten
  });

  // Mock-Daten für Geräte
  const mockDevicesData = {
    devices: [
      {
        id: 'd1',
        name: 'Wohnzimmer Licht',
        type: 'light',
        room: 'livingroom',
        status: {
          power: 'on',
          brightness: 80,
          color: '#FFFFFF'
        }
      },
      {
        id: 'd2',
        name: 'Heizung Wohnzimmer',
        type: 'thermostat',
        room: 'livingroom',
        status: {
          power: 'on',
          temperature: 21.5
        }
      },
      {
        id: 'd3',
        name: 'Küche Licht',
        type: 'light',
        room: 'kitchen',
        status: {
          power: 'off',
          brightness: 100,
          color: '#FFFFFF'
        }
      },
      {
        id: 'd4',
        name: 'Haustür',
        type: 'door',
        room: 'entrance',
        status: {
          state: 'closed'
        }
      },
      {
        id: 'd5',
        name: 'Alarm',
        type: 'security',
        room: 'entrance',
        status: {
          state: 'disarmed'
        }
      },
      {
        id: 'd6',
        name: 'Schlafzimmer Licht',
        type: 'light',
        room: 'bedroom',
        status: {
          power: 'off',
          brightness: 60,
          color: '#FFF4E0'
        }
      },
      {
        id: 'd7',
        name: 'Heizung Schlafzimmer',
        type: 'thermostat',
        room: 'bedroom',
        status: {
          power: 'on',
          temperature: 19.0
        }
      }
    ]
  };

  // Mock-Daten für Automationsregeln
  const [automationRules, setAutomationRules] = useState([
    {
      id: 'r1',
      name: 'Licht bei Dunkelheit einschalten',
      trigger: {
        type: 'time',
        time: '19:30:00'
      },
      action: {
        deviceId: 'd1',
        command: 'setPower',
        value: 'on'
      },
      enabled: true
    },
    {
      id: 'r2',
      name: 'Heizung nachts reduzieren',
      trigger: {
        type: 'time',
        time: '22:00:00'
      },
      action: {
        deviceId: 'd2',
        command: 'setTemperature',
        value: 19
      },
      enabled: true
    }
  ]);

  // Mock-Daten für Geräteaktivitäten
  const mockActivityHistory = [
    {
      id: 'a1',
      deviceId: 'd1',
      deviceName: 'Wohnzimmer Licht',
      action: 'Ein',
      timestamp: '2023-04-01T19:30:05Z',
      trigger: 'Automatisierung "Licht bei Dunkelheit einschalten"'
    },
    {
      id: 'a2',
      deviceId: 'd2',
      deviceName: 'Heizung Wohnzimmer',
      action: 'Temperatur auf 21.5°C gesetzt',
      timestamp: '2023-04-01T17:15:20Z',
      trigger: 'Manuell'
    },
    {
      id: 'a3',
      deviceId: 'd6',
      deviceName: 'Schlafzimmer Licht',
      action: 'Aus',
      timestamp: '2023-04-01T08:05:15Z',
      trigger: 'Manuell'
    }
  ];

  // Tatsächliche oder Mock-Daten verwenden
  const smartThingsData = devicesData || mockDevicesData;

  // Nach Raum filtern
  const filteredDevices = selectedRoom === 'all'
    ? smartThingsData.devices
    : smartThingsData.devices.filter(device => device.room === selectedRoom);

  // Gerät steuern
  const mutation = useMutation(
    ({ deviceId, command, value }) => controlDevice(deviceId, command, value),
    {
      onSuccess: () => {
        // Geräteliste neu laden nach erfolgreicher Aktion
        refetchDevices();
      }
    }
  );

  // Geräte-Status ändern
  const handleDeviceToggle = (device) => (event) => {
    const newPowerState = event.target.checked ? 'on' : 'off';
    
    // Lokalen State aktualisieren für sofortige UI-Reaktion
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
    
    // API-Aufruf
    mutation.mutate({
      deviceId: device.id,
      command: 'setPower',
      value: newPowerState
    });
  };

  // Helligkeit ändern
  const handleBrightnessChange = (device) => (event, newValue) => {
    // Lokalen State aktualisieren
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
    
    // API-Aufruf
    mutation.mutate({
      deviceId: device.id,
      command: 'setBrightness',
      value: newValue
    });
  };

  // Temperatur ändern
  const handleTemperatureChange = (device) => (event, newValue) => {
    // Lokalen State aktualisieren
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
    
    // API-Aufruf
    mutation.mutate({
      deviceId: device.id,
      command: 'setTemperature',
      value: newValue
    });
  };

  // Tab wechseln
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Raum auswählen
  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
  };

  // Gerätesymbol nach Typ
  const getDeviceIcon = (type, size = 'medium') => {
    switch(type) {
      case 'light':
        return <LightbulbIcon fontSize={size} sx={{ color: '#FFD700' }} />;
      case 'thermostat':
        return <ThermostatIcon fontSize={size} sx={{ color: '#FF6347' }} />;
      case 'door':
        return <DoorFrontIcon fontSize={size} sx={{ color: '#8B4513' }} />;
      case 'security':
        return <SecurityIcon fontSize={size} sx={{ color: '#4682B4' }} />;
      default:
        return <DevicesIcon fontSize={size} />;
    }
  };

  // Steuerelemente basierend auf Gerätetyp rendern
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

  // Gerätedialog öffnen
  const handleOpenDeviceDialog = () => {
    setOpenDeviceDialog(true);
  };

  // Gerätedialog schließen
  const handleCloseDeviceDialog = () => {
    setOpenDeviceDialog(false);
  };

  // Automationsdialog öffnen
  const handleOpenRuleDialog = (rule = null) => {
    setEditingRule(rule);
    setOpenRuleDialog(true);
  };

  // Automationsdialog schließen
  const handleCloseRuleDialog = () => {
    setEditingRule(null);
    setOpenRuleDialog(false);
  };

  // Regel löschen
  const handleDeleteRule = (ruleId) => {
    setAutomationRules(automationRules.filter(rule => rule.id !== ruleId));
  };

  // Regel aktivieren/deaktivieren
  const handleToggleRule = (ruleId) => {
    setAutomationRules(automationRules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  // Datum formatieren
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('de-DE', options);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="div">
          Smart Home
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenDeviceDialog}
            sx={{ mr: 1 }}
          >
            Gerät hinzufügen
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<AutomationIcon />}
            onClick={() => handleOpenRuleDialog()}
          >
            Automation erstellen
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<DevicesIcon />} label="Geräte" />
          <Tab icon={<AutomationIcon />} label="Automationen" />
          <Tab icon={<HistoryIcon />} label="Aktivitäten" />
          <Tab icon={<SettingsIcon />} label="Einstellungen" />
        </Tabs>
      </Paper>

      {/* Geräte Tab */}
      {tabValue === 0 && (
        <>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="room-select-label">Raum</InputLabel>
              <Select
                labelId="room-select-label"
                id="room-select"
                value={selectedRoom}
                label="Raum"
                onChange={handleRoomChange}
              >
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={3}>
            {filteredDevices.map((device) => (
              <Grid item xs={12} sm={6} md={4} key={device.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ mr: 2 }}>
                        {getDeviceIcon(device.type)}
                      </Box>
                      <Box>
                        <Typography variant="h6">{device.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {rooms.find(room => room.id === device.room)?.name || device.room}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    {renderDeviceControls(device)}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Automationen Tab */}
      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Automatisierungsregeln</Typography>
            <List>
              {automationRules.map((rule) => (
                <React.Fragment key={rule.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton 
                          edge="end" 
                          aria-label="edit"
                          onClick={() => handleOpenRuleDialog(rule)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleDeleteRule(rule.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <Switch
                        edge="start"
                        checked={rule.enabled}
                        onChange={() => handleToggleRule(rule.id)}
                        inputProps={{ 'aria-labelledby': `rule-${rule.id}` }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={`rule-${rule.id}`}
                      primary={rule.name}
                      secondary={
                        <>
                          {rule.trigger.type === 'time' && `Täglich um ${rule.trigger.time.substring(0, 5)} Uhr`}
                          <br />
                          Aktion: {
                            rule.action.command === 'setPower' 
                              ? `Gerät ${rule.action.value === 'on' ? 'einschalten' : 'ausschalten'}`
                              : rule.action.command === 'setTemperature'
                                ? `Temperatur auf ${rule.action.value}°C setzen`
                                : rule.action.command
                          }
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            {automationRules.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  Keine Automatisierungsregeln definiert
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenRuleDialog()}
                  sx={{ mt: 2 }}
                >
                  Regel erstellen
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Aktivitäten Tab */}
      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Geräteaktivitäten</Typography>
            <List>
              {mockActivityHistory.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getDeviceIcon(
                        smartThingsData.devices.find(d => d.id === activity.deviceId)?.type || 'default',
                        'small'
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${activity.deviceName}: ${activity.action}`}
                      secondary={
                        <>
                          {formatDate(activity.timestamp)}
                          <br />
                          Auslöser: {activity.trigger}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Einstellungen Tab */}
      {tabValue === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>SmartThings Einstellungen</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Aktualisierungsintervall (Sekunden)"
                  type="number"
                  defaultValue={30}
                  InputProps={{ inputProps: { min: 5, max: 300 } }}
                  helperText="Wie oft sollen die Gerätedaten aktualisiert werden?"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>SmartThings Integration</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">Status: Verbunden</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Letztes Update: {new Date().toLocaleString('de-DE')}
                  </Typography>
                </Box>
                <Button variant="outlined" color="error">
                  Verbindung trennen
                </Button>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button variant="contained" color="primary">
                  Einstellungen speichern
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Dialog zum Hinzufügen eines Geräts */}
      <Dialog open={openDeviceDialog} onClose={handleCloseDeviceDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Gerät hinzufügen</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Gerätename"
            type="text"
            fullWidth
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Gerätetyp</InputLabel>
            <Select defaultValue="">
              <MenuItem value="light">Licht</MenuItem>
              <MenuItem value="thermostat">Thermostat</MenuItem>
              <MenuItem value="door">Tür/Fenster</MenuItem>
              <MenuItem value="security">Sicherheit</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Raum</InputLabel>
            <Select defaultValue="">
              {rooms.filter(room => room.id !== 'all').map((room) => (
                <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeviceDialog}>Abbrechen</Button>
          <Button onClick={handleCloseDeviceDialog} variant="contained">Hinzufügen</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog zum Erstellen/Bearbeiten einer Automationsregel */}
      <Dialog open={openRuleDialog} onClose={handleCloseRuleDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRule ? 'Automationsregel bearbeiten' : 'Neue Automationsregel erstellen'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Regelname"
            type="text"
            fullWidth
            required
            defaultValue={editingRule?.name || ''}
          />
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Auslöser</Typography>
          <FormControl fullWidth margin="dense">
            <InputLabel>Typ</InputLabel>
            <Select defaultValue="time">
              <MenuItem value="time">Zeitplan</MenuItem>
              <MenuItem value="device">Gerätestatus</MenuItem>
              <MenuItem value="condition">Bedingung</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            label="Zeit"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            defaultValue={editingRule?.trigger.time?.substring(0, 5) || '19:30'}
          />
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Aktion</Typography>
          <FormControl fullWidth margin="dense">
            <InputLabel>Gerät</InputLabel>
            <Select defaultValue={editingRule?.action.deviceId || ''}>
              {smartThingsData.devices.map((device) => (
                <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Befehl</InputLabel>
            <Select defaultValue={editingRule?.action.command || 'setPower'}>
              <MenuItem value="setPower">Ein/Ausschalten</MenuItem>
              <MenuItem value="setBrightness">Helligkeit ändern</MenuItem>
              <MenuItem value="setTemperature">Temperatur ändern</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Wert</InputLabel>
            <Select defaultValue={editingRule?.action.value || 'on'}>
              <MenuItem value="on">Ein</MenuItem>
              <MenuItem value="off">Aus</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRuleDialog}>Abbrechen</Button>
          <Button onClick={handleCloseRuleDialog} variant="contained">
            {editingRule ? 'Aktualisieren' : 'Erstellen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmartThings;