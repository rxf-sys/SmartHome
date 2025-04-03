import React, { useContext } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../context/AuthContext';

// Widgets
import WeatherWidget from '../components/WeatherWidget';
import BankingWidget from '../components/BankingWidget';
import SmartThingsWidget from '../components/SmartThingsWidget';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  height: '100%'
}));

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom component="div">
        Willkommen, {user?.name || 'User'}!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Hier ist ein Überblick über dein Smart Home:
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Weather Widget */}
        <Grid item xs={12} md={4}>
          <Item>
            <WeatherWidget />
          </Item>
        </Grid>

        {/* Banking Widget */}
        <Grid item xs={12} md={4}>
          <Item>
            <BankingWidget />
          </Item>
        </Grid>

        {/* SmartThings Widget */}
        <Grid item xs={12} md={4}>
          <Item>
            <SmartThingsWidget />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;