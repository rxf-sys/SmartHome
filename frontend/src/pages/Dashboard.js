import React, { useContext, useState } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  useTheme, 
  alpha, 
  IconButton,
  Chip,
  Stack,
  Skeleton,
  Fade,
  Paper,
  Tooltip,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../context/AuthContext';
import { useQuery } from 'react-query';
import { getDashboardData } from '../services/dashboardService';

// Icons
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Widgets
import WeatherWidget from '../components/WeatherWidget';
import BankingWidget from '../components/BankingWidget';
import SmartThingsWidget from '../components/SmartThingsWidget';

// Styled Components
const DashboardCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 12,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
  position: 'relative',
  overflow: 'visible'
}));

const CardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main
  }
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 8,
  height: 24,
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: status === 'online' 
    ? alpha(theme.palette.success.main, 0.1)
    : alpha(theme.palette.error.main, 0.1),
  color: status === 'online' 
    ? theme.palette.success.main 
    : theme.palette.error.main,
  border: `1px solid ${status === 'online' 
    ? alpha(theme.palette.success.main, 0.5) 
    : alpha(theme.palette.error.main, 0.5)}`
}));

const HighlightBox = styled(Box)(({ theme, color = 'primary' }) => ({
  backgroundColor: alpha(theme.palette[color].main, 0.1),
  borderRadius: 8,
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`
}));

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // Dashboard-Daten mit React Query abrufen
  const { data, isLoading, error, refetch } = useQuery('dashboardData', getDashboardData, {
    refetchInterval: 900000, // Alle 15 Minuten aktualisieren
    staleTime: 300000, // Daten gelten für 5 Minuten als aktuell
    onError: (error) => {
      console.error('Fehler beim Laden der Dashboard-Daten:', error);
    }
  });

  // Manuelles Aktualisieren der Dashboard-Daten
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Aktuelle Zeit und Datum
  const currentTime = new Date().toLocaleTimeString('de-DE', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const currentDate = new Date().toLocaleDateString('de-DE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Loading Skeleton
  const renderSkeleton = () => (
    <Box sx={{ width: '100%' }}>
      <Skeleton variant="text" sx={{ fontSize: '2rem', width: '60%', mb: 1 }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '40%', mb: 3 }} />
      <Grid container spacing={3}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} md={4} key={item}>
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '40%', mb: 2 }} />
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={4} key={`widget-${item}`}>
              <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );

  // Fehleranzeige
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Fehler beim Laden der Dashboard-Daten
        </Typography>
        <Typography variant="body1" paragraph>
          {error.message}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh}
        >
          Erneut versuchen
        </Button>
      </Box>
    );
  }

  return (
    <Fade in={!isLoading} timeout={800}>
      <Box sx={{ flexGrow: 1 }}>
        {isLoading ? (
          renderSkeleton()
        ) : (
          <>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                Willkommen, {user?.name || data?.user?.name || 'User'}!
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {currentDate} • {currentTime} • Alles läuft reibungslos
              </Typography>
            </Box>

            {/* Quick Stats Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Wetter-Stat */}
              <Grid item xs={12} sm={4}>
                <HighlightBox color="primary">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        mr: 2, 
                        p: 1, 
                        borderRadius: '50%', 
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <WbSunnyIcon />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {data?.weather?.location || 'Wetter'}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {data?.weather ? `${data.weather.temperature}°C` : 'Keine Daten'}
                      </Typography>
                    </Box>
                  </Box>
                  <StatusChip 
                    label={data?.weather ? 'Online' : 'Offline'} 
                    status={data?.weather ? 'online' : 'offline'} 
                    size="small" 
                  />
                </HighlightBox>
              </Grid>
              
              {/* Banking-Stat */}
              <Grid item xs={12} sm={4}>
                <HighlightBox color="secondary">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        mr: 2, 
                        p: 1, 
                        borderRadius: '50%', 
                        bgcolor: alpha(theme.palette.secondary.main, 0.2),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <AccountBalanceIcon />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Bankkonto
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {data?.banking?.accounts?.[0] 
                          ? `${data.banking.accounts[0].balance.toLocaleString('de-DE')} €` 
                          : 'Keine Daten'}
                      </Typography>
                    </Box>
                  </Box>
                  <StatusChip 
                    label={data?.banking ? 'Online' : 'Offline'} 
                    status={data?.banking ? 'online' : 'offline'} 
                    size="small" 
                  />
                </HighlightBox>
              </Grid>
              
              {/* Smart Home Stat */}
              <Grid item xs={12} sm={4}>
                <HighlightBox color="success">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        mr: 2, 
                        p: 1, 
                        borderRadius: '50%', 
                        bgcolor: alpha(theme.palette.success.main, 0.2),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <PowerSettingsNewIcon />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Aktive Geräte
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {data?.smartThings 
                          ? `${data.smartThings.activeDevices}/${data.smartThings.totalDevices}` 
                          : 'Keine Daten'}
                      </Typography>
                    </Box>
                  </Box>
                  <StatusChip 
                    label={data?.smartThings ? 'Online' : 'Offline'} 
                    status={data?.smartThings ? 'online' : 'offline'} 
                    size="small" 
                  />
                </HighlightBox>
              </Grid>
            </Grid>

            {/* Main Widgets Section */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Smart Home Übersicht
              </Typography>
              <Tooltip title="Dashboard aktualisieren">
                <IconButton onClick={handleRefresh} disabled={refreshing}>
                  <RefreshIcon sx={{ animation: refreshing ? 'spin 1.5s linear infinite' : 'none' }} />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Grid container spacing={3}>
              {/* Weather Widget */}
              <Grid item xs={12} md={4}>
                <DashboardCard>
                  <CardContent>
                    <CardHeader>
                      <CardTitle variant="h6">
                        <WbSunnyIcon /> Wetter
                      </CardTitle>
                      <Button 
                        size="small" 
                        endIcon={<ArrowForwardIcon />}
                        href="/weather"
                      >
                        Details
                      </Button>
                    </CardHeader>
                    
                    {data?.weather ? (
                      <WeatherWidget compact={true} />
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          Keine Wetterdaten verfügbar
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          sx={{ mt: 2 }}
                          href="/weather"
                        >
                          Wetter einrichten
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </DashboardCard>
              </Grid>

              {/* Banking Widget */}
              <Grid item xs={12} md={4}>
                <DashboardCard>
                  <CardContent>
                    <CardHeader>
                      <CardTitle variant="h6">
                        <AccountBalanceIcon /> Finanzen
                      </CardTitle>
                      <Button 
                        size="small" 
                        endIcon={<ArrowForwardIcon />}
                        href="/banking"
                      >
                        Details
                      </Button>
                    </CardHeader>
                    
                    {data?.banking ? (
                      <>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {data.banking.accounts[0].balance.toLocaleString('de-DE')} €
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Aktueller Kontostand {data.banking.accounts[0].name}
                          </Typography>
                        </Box>
                        
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Letzte Transaktionen</Typography>
                        
                        {data.banking.recentTransactions.map((transaction, index) => (
                          <Box 
                            key={transaction.id}
                            sx={{ 
                              mb: 1, 
                              p: 1, 
                              borderRadius: 1, 
                              bgcolor: index === 0 
                                ? alpha(theme.palette.success.main, 0.1) 
                                : 'background.paper' 
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2">{transaction.description}</Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: transaction.amount >= 0 
                                    ? theme.palette.success.main 
                                    : theme.palette.error.main, 
                                  fontWeight: 600 
                                }}
                              >
                                {transaction.amount >= 0 ? '+' : ''}
                                {transaction.amount.toLocaleString('de-DE')} €
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(transaction.date).toLocaleDateString('de-DE')}
                            </Typography>
                          </Box>
                        ))}
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          Keine Bankdaten verfügbar
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          sx={{ mt: 2 }}
                          href="/banking"
                        >
                          Banking einrichten
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </DashboardCard>
              </Grid>

              {/* SmartThings Widget */}
              <Grid item xs={12} md={4}>
                <DashboardCard>
                  <CardContent>
                    <CardHeader>
                      <CardTitle variant="h6">
                        <DeviceThermostatIcon /> Smart Home
                      </CardTitle>
                      <Button 
                        size="small" 
                        endIcon={<ArrowForwardIcon />}
                        href="/smartthings"
                      >
                        Details
                      </Button>
                    </CardHeader>
                    
                    {data?.smartThings ? (
                      <Box sx={{ mb: 2 }}>
                        {data.smartThings.devices.map((device) => {
                          let icon;
                          let statusColor;
                          let statusText;
                          
                          // Gerätespezifische Icons und Status
                          if (device.type === 'light') {
                            icon = <WbSunnyIcon color="warning" />;
                            statusColor = device.status.power === 'on' ? 'success' : 'default';
                            statusText = device.status.power === 'on' ? 'An' : 'Aus';
                          } else if (device.type === 'thermostat') {
                            icon = <DeviceThermostatIcon color="secondary" />;
                            statusColor = device.status.power === 'on' ? 'primary' : 'default';
                            statusText = `${device.status.temperature}°C`;
                          } else if (device.type === 'door') {
                            icon = <PowerSettingsNewIcon color="info" />;
                            statusColor = device.status.state === 'closed' ? 'success' : 'error';
                            statusText = device.status.state === 'closed' ? 'Geschlossen' : 'Geöffnet';
                          } else {
                            icon = <PowerSettingsNewIcon />;
                            statusColor = 'default';
                            statusText = 'Unbekannt';
                          }
                          
                          return (
                            <Box 
                              key={device.id} 
                              sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                            >
                              <Box 
                                sx={{ 
                                  p: 1, 
                                  borderRadius: '50%', 
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  mr: 2
                                }}
                              >
                                {icon}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center' 
                                }}>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {device.name}
                                  </Typography>
                                  <Chip 
                                    label={statusText} 
                                    size="small" 
                                    color={statusColor}
                                    sx={{ 
                                      fontWeight: 600,
                                      fontSize: '0.7rem',
                                      height: 20
                                    }} 
                                  />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {device.type === 'light' && `Helligkeit: ${device.status.brightness}%`}
                                  {device.type === 'thermostat' && `Heizung ${device.status.power === 'on' ? 'aktiv' : 'inaktiv'}`}
                                  {device.type === 'door' && `Eingangstür`}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          Keine Smart Home Geräte verfügbar
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          sx={{ mt: 2 }}
                          href="/smartthings"
                        >
                          Geräte einrichten
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </DashboardCard>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Fade>
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

export default Dashboard;