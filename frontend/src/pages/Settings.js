import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Alert,
  Snackbar
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CloudIcon from '@mui/icons-material/Cloud';
import DevicesIcon from '@mui/icons-material/Devices';
import HelpIcon from '@mui/icons-material/Help';
import DeleteIcon from '@mui/icons-material/Delete';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const [profileFormData, setProfileFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Benachrichtigungseinstellungen
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    bankingAlerts: true,
    weatherAlerts: false,
    deviceStatusAlerts: true,
  });

  // Passwort-Sichtbarkeit umschalten
  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  // Profilformular aktualisieren
  const handleProfileChange = (e) => {
    setProfileFormData({
      ...profileFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Passwortformular aktualisieren
  const handlePasswordChange = (e) => {
    setPasswordFormData({
      ...passwordFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Benachrichtigungseinstellungen aktualisieren
  const handleNotificationChange = (e) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked,
    });
  };

  // Löschdialog öffnen
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  // Löschdialog schließen
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteConfirmText('');
  };

  // Profil aktualisieren
  const handleUpdateProfile = () => {
    // Hier würde der API-Aufruf zum Aktualisieren des Profils erfolgen
    setNotification({
      open: true,
      message: 'Profil erfolgreich aktualisiert',
      severity: 'success',
    });
  };

  // Passwort ändern
  const handleChangePassword = () => {
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setNotification({
        open: true,
        message: 'Passwörter stimmen nicht überein',
        severity: 'error',
      });
      return;
    }

    // Hier würde der API-Aufruf zum Ändern des Passworts erfolgen
    setNotification({
      open: true,
      message: 'Passwort erfolgreich geändert',
      severity: 'success',
    });
    setPasswordFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  // Benachrichtigungseinstellungen speichern
  const handleSaveNotificationSettings = () => {
    // Hier würde der API-Aufruf zum Speichern der Benachrichtigungseinstellungen erfolgen
    setNotification({
      open: true,
      message: 'Benachrichtigungseinstellungen gespeichert',
      severity: 'success',
    });
  };

  // Konto löschen
  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'LÖSCHEN') {
      setNotification({
        open: true,
        message: 'Bitte geben Sie "LÖSCHEN" ein, um zu bestätigen',
        severity: 'error',
      });
      return;
    }

    // Hier würde der API-Aufruf zum Löschen des Kontos erfolgen
    handleCloseDeleteDialog();
    logout();
  };

  // Benachrichtigung schließen
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({
      ...notification,
      open: false,
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom component="div">
        Einstellungen
      </Typography>

      <Grid container spacing={3}>
        {/* Profilbereich */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountCircleIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Profil</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Avatar
                  sx={{ width: 100, height: 100, fontSize: 40 }}
                >
                  {profileFormData.name ? profileFormData.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </Box>

              <TextField
                fullWidth
                label="Name"
                name="name"
                value={profileFormData.name}
                onChange={handleProfileChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="E-Mail"
                name="email"
                value={profileFormData.email}
                onChange={handleProfileChange}
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateProfile}
                sx={{ mt: 2 }}
              >
                Profil aktualisieren
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LockIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Passwort ändern</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <TextField
                fullWidth
                label="Aktuelles Passwort"
                name="currentPassword"
                type={showPassword.currentPassword ? 'text' : 'password'}
                value={passwordFormData.currentPassword}
                onChange={handlePasswordChange}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        edge="end"
                      >
                        {showPassword.confirmPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleChangePassword}
                sx={{ mt: 2 }}
              >
                Passwort ändern
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Benachrichtigungen und weitere Einstellungen */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Benachrichtigungen</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <List>
                <ListItem>
                  <ListItemText 
                    primary="E-Mail-Benachrichtigungen" 
                    secondary="Erhalten Sie Updates und Warnungen per E-Mail"
                  />
                  <Switch
                    name="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={handleNotificationChange}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Push-Benachrichtigungen" 
                    secondary="Erhalten Sie Updates und Warnungen direkt im Browser"
                  />
                  <Switch
                    name="pushNotifications"
                    checked={notificationSettings.pushNotifications}
                    onChange={handleNotificationChange}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Banking-Alarme" 
                    secondary="Benachrichtigungen bei ungewöhnlichen Kontobewegungen"
                  />
                  <Switch
                    name="bankingAlerts"
                    checked={notificationSettings.bankingAlerts}
                    onChange={handleNotificationChange}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Wetter-Alarme" 
                    secondary="Benachrichtigungen bei extremen Wetterbedingungen"
                  />
                  <Switch
                    name="weatherAlerts"
                    checked={notificationSettings.weatherAlerts}
                    onChange={handleNotificationChange}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Gerätestatus-Alarme" 
                    secondary="Benachrichtigungen bei Statusänderungen von Smart-Home-Geräten"
                  />
                  <Switch
                    name="deviceStatusAlerts"
                    checked={notificationSettings.deviceStatusAlerts}
                    onChange={handleNotificationChange}
                  />
                </ListItem>
              </List>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveNotificationSettings}
                sx={{ mt: 2 }}
              >
                Einstellungen speichern
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Sicherheit und Datenschutz</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Typography variant="subtitle1" gutterBottom>
                Verbundene Dienste
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AccountBalanceIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Banking-Dienste" 
                    secondary="Verbunden mit 2 Bankkonten"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CloudIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Wetter-API" 
                    secondary="Verbunden"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DevicesIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="SmartThings" 
                    secondary="Verbunden mit 7 Geräten"
                  />
                </ListItem>
              </List>

              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Datenverwaltung
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<HelpIcon />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Datennutzung und Datenschutz
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                fullWidth
                onClick={handleOpenDeleteDialog}
              >
                Konto löschen
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Löschbestätigungsdialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Konto löschen?</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Achtung: Diese Aktion kann nicht rückgängig gemacht werden.
            Alle Ihre Daten werden dauerhaft gelöscht.
          </Alert>
          <Typography variant="body1" paragraph>
            Um fortzufahren, geben Sie bitte "LÖSCHEN" ein, um zu bestätigen:
          </Typography>
          <TextField
            fullWidth
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            variant="outlined"
            placeholder="LÖSCHEN"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Abbrechen</Button>
          <Button 
            onClick={handleDeleteAccount} 
            color="error" 
            variant="contained"
            disabled={deleteConfirmText !== 'LÖSCHEN'}
          >
            Konto endgültig löschen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Benachrichtigungen */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;