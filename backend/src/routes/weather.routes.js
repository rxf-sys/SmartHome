const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { 
  getCurrentWeather, 
  getWeatherForecast, 
  getWeatherAlerts, 
  searchLocations, 
  updateWeatherSettings 
} = require('../controllers/weather.controller');

// Alle Wetter-Routen sind geschützt
router.use(auth);

// Aktuelles Wetter abrufen
router.get('/', getCurrentWeather);

// Wettervorhersage abrufen
router.get('/forecast', getWeatherForecast);

// Wetterwarnungen abrufen
router.get('/alerts', getWeatherAlerts);

// Standort-Suchergebnisse abrufen
router.get('/locations', searchLocations);

// Benutzereinstellungen für Wetter aktualisieren
router.put('/settings', updateWeatherSettings);

module.exports = router;