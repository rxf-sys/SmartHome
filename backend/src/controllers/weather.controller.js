const axios = require('axios');
const User = require('../models/user.model');

// OpenWeatherMap API-Konfiguration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0';

/**
 * Aktuelle Wetterdaten abrufen
 */
exports.getCurrentWeather = async (req, res) => {
  try {
    const { location } = req.query;
    let locationData;

    // Wenn kein Standort angegeben wurde, den Standardstandort des Benutzers verwenden
    if (!location) {
      const user = await User.findById(req.user.id);
      
      // Wenn der Benutzer einen Standardstandort hat, diesen verwenden
      if (user.preferences && user.preferences.weatherLocation) {
        locationData = {
          name: user.preferences.weatherLocation,
          lat: user.preferences.weatherLocationLat,
          lon: user.preferences.weatherLocationLon
        };
      } else {
        // Standardwert, falls kein Ort gespeichert ist
        locationData = {
          name: 'Berlin',
          lat: 52.520008,
          lon: 13.404954
        };
      }
    } else {
      // Geocoding-API verwenden, um Koordinaten für den angegebenen Standort zu erhalten
      const geoResponse = await axios.get(`${GEO_BASE_URL}/direct`, {
        params: {
          q: location,
          limit: 1,
          appid: OPENWEATHER_API_KEY
        }
      });

      if (geoResponse.data.length === 0) {
        return res.status(404).json({ msg: 'Standort nicht gefunden' });
      }

      const geoData = geoResponse.data[0];
      locationData = {
        name: geoData.name,
        lat: geoData.lat,
        lon: geoData.lon
      };
    }

    // Aktuelle Wetterdaten abrufen
    const weatherResponse = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat: locationData.lat,
        lon: locationData.lon,
        units: 'metric',
        lang: 'de',
        appid: OPENWEATHER_API_KEY
      }
    });

    const weatherData = weatherResponse.data;

    // Daten formatieren und zurückgeben
    res.json({
      location: locationData.name,
      country: weatherData.sys.country,
      temperature: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      tempMin: Math.round(weatherData.main.temp_min),
      tempMax: Math.round(weatherData.main.temp_max),
      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed * 3.6), // m/s zu km/h umrechnen
      pressure: weatherData.main.pressure,
      visibility: weatherData.visibility / 1000, // m zu km umrechnen
      sunrise: new Date(weatherData.sys.sunrise * 1000).toISOString(),
      sunset: new Date(weatherData.sys.sunset * 1000).toISOString(),
      timezone: weatherData.timezone,
      lastUpdate: new Date().toISOString()
    });
  } catch (err) {
    console.error('Fehler beim Abrufen des aktuellen Wetters:', err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Wettervorhersage abrufen
 */
exports.getWeatherForecast = async (req, res) => {
  try {
    const { location, days } = req.query;
    const forecastDays = parseInt(days) || 5;
    let locationData;

    // Wenn kein Standort angegeben wurde, den Standardstandort des Benutzers verwenden
    if (!location) {
      const user = await User.findById(req.user.id);
      
      // Wenn der Benutzer einen Standardstandort hat, diesen verwenden
      if (user.preferences && user.preferences.weatherLocation) {
        locationData = {
          name: user.preferences.weatherLocation,
          lat: user.preferences.weatherLocationLat,
          lon: user.preferences.weatherLocationLon
        };
      } else {
        // Standardwert, falls kein Ort gespeichert ist
        locationData = {
          name: 'Berlin',
          lat: 52.520008,
          lon: 13.404954
        };
      }
    } else {
      // Geocoding-API verwenden, um Koordinaten für den angegebenen Standort zu erhalten
      const geoResponse = await axios.get(`${GEO_BASE_URL}/direct`, {
        params: {
          q: location,
          limit: 1,
          appid: OPENWEATHER_API_KEY
        }
      });

      if (geoResponse.data.length === 0) {
        return res.status(404).json({ msg: 'Standort nicht gefunden' });
      }

      const geoData = geoResponse.data[0];
      locationData = {
        name: geoData.name,
        lat: geoData.lat,
        lon: geoData.lon
      };
    }

    // 5-Tage-Vorhersage abrufen (in 3-Stunden-Intervallen)
    const forecastResponse = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        lat: locationData.lat,
        lon: locationData.lon,
        units: 'metric',
        lang: 'de',
        appid: OPENWEATHER_API_KEY
      }
    });

    const forecastData = forecastResponse.data;
    
    // Daten nach Tagen gruppieren
    const dailyForecasts = [];
    const forecastsByDay = {};

    // Gruppiere Vorhersagen nach Datum
    forecastData.list.forEach((forecast) => {
      const date = forecast.dt_txt.split(' ')[0];
      
      if (!forecastsByDay[date]) {
        forecastsByDay[date] = [];
      }
      
      forecastsByDay[date].push(forecast);
    });

    // Tägliche Vorhersagen berechnen (Durchschnittswerte, Min/Max)
    Object.keys(forecastsByDay).slice(0, forecastDays).forEach((date) => {
      const dayForecasts = forecastsByDay[date];
      
      // Min/Max-Temperatur für den Tag
      const temps = dayForecasts.map((f) => f.main.temp);
      const tempMin = Math.round(Math.min(...temps));
      const tempMax = Math.round(Math.max(...temps));
      
      // Häufigste Wetterbedingung des Tages ermitteln
      const conditionCounts = {};
      dayForecasts.forEach((f) => {
        const condition = f.weather[0].main;
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      });
      
      const mostCommonCondition = Object.keys(conditionCounts).reduce(
        (a, b) => (conditionCounts[a] > conditionCounts[b] ? a : b),
        Object.keys(conditionCounts)[0]
      );
      
      // Icon für die häufigste Wetterbedingung finden
      const iconForCondition = dayForecasts.find(
        (f) => f.weather[0].main === mostCommonCondition
      ).weather[0].icon;
      
      // Durchschnittliche Feuchtigkeit
      const avgHumidity = Math.round(
        dayForecasts.reduce((sum, f) => sum + f.main.humidity, 0) / dayForecasts.length
      );
      
      // Durchschnittliche Windgeschwindigkeit
      const avgWindSpeed = Math.round(
        (dayForecasts.reduce((sum, f) => sum + f.wind.speed, 0) / dayForecasts.length) * 3.6 // m/s zu km/h
      );
      
      // Niederschlagswahrscheinlichkeit
      const maxPop = Math.round(
        Math.max(...dayForecasts.map((f) => f.pop * 100)) // in Prozent umwandeln
      );
      
      // Niederschlagsmenge (falls vorhanden)
      let totalPrecipitation = 0;
      dayForecasts.forEach((f) => {
        if (f.rain && f.rain['3h']) {
          totalPrecipitation += f.rain['3h'];
        }
      });
      
      dailyForecasts.push({
        date,
        temperature: {
          min: tempMin,
          max: tempMax
        },
        condition: mostCommonCondition,
        description: dayForecasts.find((f) => f.weather[0].main === mostCommonCondition).weather[0].description,
        icon: iconForCondition,
        humidity: avgHumidity,
        windSpeed: avgWindSpeed,
        precipitation: {
          probability: maxPop,
          amount: totalPrecipitation
        }
      });
    });

    res.json({
      location: locationData.name,
      country: forecastData.city.country,
      timezone: forecastData.city.timezone,
      forecast: dailyForecasts
    });
  } catch (err) {
    console.error('Fehler beim Abrufen der Wettervorhersage:', err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Wetterwarnungen abrufen
 */
exports.getWeatherAlerts = async (req, res) => {
  try {
    const { location } = req.query;
    let locationData;

    // Wenn kein Standort angegeben wurde, den Standardstandort des Benutzers verwenden
    if (!location) {
      const user = await User.findById(req.user.id);
      
      // Wenn der Benutzer einen Standardstandort hat, diesen verwenden
      if (user.preferences && user.preferences.weatherLocation) {
        locationData = {
          name: user.preferences.weatherLocation,
          lat: user.preferences.weatherLocationLat,
          lon: user.preferences.weatherLocationLon
        };
      } else {
        // Standardwert, falls kein Ort gespeichert ist
        locationData = {
          name: 'Berlin',
          lat: 52.520008,
          lon: 13.404954
        };
      }
    } else {
      // Geocoding-API verwenden, um Koordinaten für den angegebenen Standort zu erhalten
      const geoResponse = await axios.get(`${GEO_BASE_URL}/direct`, {
        params: {
          q: location,
          limit: 1,
          appid: OPENWEATHER_API_KEY
        }
      });

      if (geoResponse.data.length === 0) {
        return res.status(404).json({ msg: 'Standort nicht gefunden' });
      }

      const geoData = geoResponse.data[0];
      locationData = {
        name: geoData.name,
        lat: geoData.lat,
        lon: geoData.lon
      };
    }

    // One Call API für Wetterwarnungen verwenden (falls verfügbar in deinem Plan)
    const alertsResponse = await axios.get(`${OPENWEATHER_BASE_URL}/onecall`, {
      params: {
        lat: locationData.lat,
        lon: locationData.lon,
        exclude: 'current,minutely,hourly,daily',
        appid: OPENWEATHER_API_KEY
      }
    });

    const alertsData = alertsResponse.data;
    
    res.json({
      location: locationData.name,
      alerts: alertsData.alerts || [] // Falls keine Warnungen vorhanden sind
    });
  } catch (err) {
    console.error('Fehler beim Abrufen der Wetterwarnungen:', err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Standorte suchen
 */
exports.searchLocations = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ msg: 'Suchbegriff erforderlich' });
    }
    
    // Geocoding-API verwenden, um Standorte zu suchen
    const geoResponse = await axios.get(`${GEO_BASE_URL}/direct`, {
      params: {
        q: query,
        limit: 5,
        appid: OPENWEATHER_API_KEY
      }
    });

    // Ergebnisse formatieren
    const locations = geoResponse.data.map((location) => ({
      id: `${location.name.toLowerCase()}_${location.country.toLowerCase()}`,
      name: location.name,
      country: location.country,
      state: location.state,
      lat: location.lat,
      lon: location.lon
    }));
    
    res.json(locations);
  } catch (err) {
    console.error('Fehler bei der Standortsuche:', err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Benutzereinstellungen für Wetter aktualisieren
 */
exports.updateWeatherSettings = async (req, res) => {
  try {
    const { defaultLocation, lat, lon } = req.body;
    
    if (!defaultLocation) {
      return res.status(400).json({ msg: 'Standardstandort erforderlich' });
    }
    
    // Benutzer finden und Einstellungen aktualisieren
    const user = await User.findById(req.user.id);
    
    // Wenn Preferences noch nicht existieren, erstelle sie
    if (!user.preferences) {
      user.preferences = {};
    }
    
    user.preferences.weatherLocation = defaultLocation;
    
    // Wenn Koordinaten angegeben wurden, diese auch speichern
    if (lat && lon) {
      user.preferences.weatherLocationLat = lat;
      user.preferences.weatherLocationLon = lon;
    } else {
      // Sonst Koordinaten über die Geocoding-API abrufen
      const geoResponse = await axios.get(`${GEO_BASE_URL}/direct`, {
        params: {
          q: defaultLocation,
          limit: 1,
          appid: OPENWEATHER_API_KEY
        }
      });

      if (geoResponse.data.length > 0) {
        const geoData = geoResponse.data[0];
        user.preferences.weatherLocationLat = geoData.lat;
        user.preferences.weatherLocationLon = geoData.lon;
      }
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Wettereinstellungen erfolgreich aktualisiert',
      settings: {
        defaultLocation: user.preferences.weatherLocation,
        lat: user.preferences.weatherLocationLat,
        lon: user.preferences.weatherLocationLon
      }
    });
  } catch (err) {
    console.error('Fehler beim Aktualisieren der Wettereinstellungen:', err.message);
    res.status(500).send('Server Error');
  }
};