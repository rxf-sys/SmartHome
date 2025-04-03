const User = require('../models/user.model');
const axios = require('axios');

// OpenWeatherMap API-Konfiguration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0';

/**
 * Dashboard-Daten abrufen
 */
exports.getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Dashboard-Daten sammeln
    const dashboardData = {
      user: {
        name: user.name,
        email: user.email
      },
      weather: null,
      banking: null,
      smartThings: null
    };
    
    // Wetterdaten abrufen, wenn Benutzer einen Standardstandort hat
    if (user.preferences && user.preferences.weatherLocation) {
      try {
        // Wetterdaten abrufen
        const weatherResponse = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
          params: {
            lat: user.preferences.weatherLocationLat,
            lon: user.preferences.weatherLocationLon,
            units: 'metric',
            lang: 'de',
            appid: OPENWEATHER_API_KEY
          }
        });

        const weatherData = weatherResponse.data;

        // Daten formatieren
        dashboardData.weather = {
          location: user.preferences.weatherLocation,
          country: weatherData.sys.country,
          temperature: Math.round(weatherData.main.temp),
          feelsLike: Math.round(weatherData.main.feels_like),
          condition: weatherData.weather[0].main,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
          humidity: weatherData.main.humidity,
          windSpeed: Math.round(weatherData.wind.speed * 3.6), // m/s zu km/h umrechnen
          pressure: weatherData.main.pressure,
          sunrise: new Date(weatherData.sys.sunrise * 1000).toISOString(),
          sunset: new Date(weatherData.sys.sunset * 1000).toISOString(),
          lastUpdate: new Date().toISOString()
        };
      } catch (weatherError) {
        console.error('Fehler beim Abrufen der Wetterdaten für das Dashboard:', weatherError.message);
        // Wir setzen den Wert auf null, wenn ein Fehler auftritt
        dashboardData.weather = null;
      }
    }
    
    // Banking-Daten abrufen (Mock-Daten für dieses Beispiel)
    dashboardData.banking = {
      accounts: [
        {
          id: '1',
          name: 'Girokonto',
          balance: 2580.42,
          currency: 'EUR',
          lastUpdate: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Sparkonto',
          balance: 15000,
          currency: 'EUR',
          lastUpdate: new Date().toISOString()
        }
      ],
      recentTransactions: [
        {
          id: 't1',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 Tage zurück
          description: 'Gehalt März',
          amount: 2800,
          currency: 'EUR',
          accountId: '1'
        },
        {
          id: 't2',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 Tage zurück
          description: 'Miete April',
          amount: -950,
          currency: 'EUR',
          accountId: '1'
        },
        {
          id: 't3',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 Tag zurück
          description: 'Lebensmittel Einkauf',
          amount: -58.75,
          currency: 'EUR',
          accountId: '1'
        }
      ]
    };
    
    // SmartThings-Daten abrufen (Mock-Daten für dieses Beispiel)
    dashboardData.smartThings = {
      activeDevices: 5,
      totalDevices: 7,
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
        }
      ]
    };
    
    res.json(dashboardData);
  } catch (err) {
    console.error('Fehler beim Abrufen der Dashboard-Daten:', err.message);
    res.status(500).send('Server Error');
  }
};