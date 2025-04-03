import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  useMediaQuery,
  Button,
  InputBase,
  Card
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudIcon from '@mui/icons-material/Cloud';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import HelpIcon from '@mui/icons-material/Help';
import LightModeIcon from '@mui/icons-material/LightMode';

const drawerWidth = 260;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: alpha(theme.palette.common.black, 0.04),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.08),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: theme.palette.background.default,
    backgroundImage: `
      radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.light, 0.05)} 0, transparent 50%),
      radial-gradient(at 100% 100%, ${alpha(theme.palette.secondary.light, 0.05)} 0, transparent 50%)
    `,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    }),
  }),
);

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}));

const Layout = ({ children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isSmallScreen);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Wetter', icon: <CloudIcon />, path: '/weather' },
    { text: 'Finanzen', icon: <AccountBalanceIcon />, path: '/banking' },
    { text: 'Smart Home', icon: <DeviceThermostatIcon />, path: '/smartthings' },
    { text: 'Einstellungen', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const handleAccount = () => {
    handleClose();
    navigate('/settings');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBarStyled position="fixed" open={open} elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Smart Home Dashboard
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Suchen..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Farbmodus wechseln">
              <IconButton color="inherit" sx={{ ml: 1 }}>
                <LightModeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hilfe">
              <IconButton color="inherit" sx={{ ml: 1 }}>
                <HelpIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Benachrichtigungen">
              <IconButton
                color="inherit"
                onClick={handleNotificationMenu}
                sx={{ ml: 1 }}
              >
                <StyledBadge badgeContent={3} color="secondary">
                  <NotificationsIcon />
                </StyledBadge>
              </IconButton>
            </Tooltip>
            <Menu
              id="notifications-menu"
              anchorEl={notificationAnchorEl}
              keepMounted
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
              PaperProps={{
                sx: {
                  width: 320,
                  maxWidth: '100%',
                  mt: 1.5,
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Typography sx={{ p: 2, fontWeight: 600 }}>Benachrichtigungen</Typography>
              <MenuItem onClick={handleNotificationClose}>
                <ListItemText
                  primary="Wetterwarnungen"
                  secondary="Regenschauer in Ihrer Region erwartet"
                />
              </MenuItem>
              <MenuItem onClick={handleNotificationClose}>
                <ListItemText
                  primary="Finanzbenachrichtigung"
                  secondary="Rechnung wurde bezahlt: Stromrechnung"
                />
              </MenuItem>
              <MenuItem onClick={handleNotificationClose}>
                <ListItemText
                  primary="Smart Home Update"
                  secondary="Neues Gerät gefunden: Wohnzimmer Lampe"
                />
              </MenuItem>
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                <Button color="primary" size="small">Alle anzeigen</Button>
              </Box>
            </Menu>
            <Tooltip title="Profil">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                elevation: 2,
                sx: {
                  mt: 1.5,
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1,
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user?.name || 'Benutzer'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email || 'user@example.com'}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleAccount}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                Profil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Abmelden
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, px: 2 }}>
            <DeviceThermostatIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Smart Home
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box sx={{ px: 2, py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ width: 48, height: 48, mr: 2 }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.name || 'Benutzer'}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="outlined" 
            size="small" 
            fullWidth 
            startIcon={<SettingsIcon />}
            onClick={() => navigate('/settings')}
            sx={{ mt: 1, borderRadius: '20px' }}
          >
            Profil bearbeiten
          </Button>
        </Box>
        <Divider />
        <List sx={{ py: 2 }}>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  selected={isSelected}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    mb: 0.5,
                    color: isSelected ? 'primary.main' : 'text.primary',
                  }}
                >
                  <ListItemIcon sx={{ color: isSelected ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: isSelected ? 600 : 400 
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Card sx={{ 
            p: 2, 
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: 'white',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -20, 
                right: -20, 
                width: 120, 
                height: 120, 
                borderRadius: '50%', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }} 
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, position: 'relative', zIndex: 1 }}>
              Premium Upgrade
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, mb: 2, opacity: 0.8, position: 'relative', zIndex: 1 }}>
              Mehr Features für Ihr Smart Home
            </Typography>
            <Button 
              size="small" 
              variant="contained" 
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
                position: 'relative', 
                zIndex: 1
              }}
            >
              Upgrade
            </Button>
          </Card>
        </Box>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};

export default Layout;