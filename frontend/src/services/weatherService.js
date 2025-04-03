import api from './api';

/**
 * Aktuelle Wetterdaten für angegebenen Standort oder Standardstandort des Benutzers abrufen
 * @param {string} location Optional: Standort für den Wetterdaten abgerufen werden sollen
 * @returns {Promise} Wetterdaten
 */
export const getCurrentWeather = async (location = null) => {
  const params = location ? { location } : {};
  const response = await api.get('/weather', { params });
  return response.data;
};

/**
 * Wettervorhersage für die nächsten Tage abrufen
 * @param {string} location Optional: Standort für den die Vorhersage abgerufen werden soll
 * @param {number} days Optional: Anzahl der Tage für die Vorhersage (Standard: 5)
 * @returns {Promise} Wettervorhersagedaten
 */
export const getWeatherForecast = async (location = null, days = 5) => {
  const params = { days };
  if (location) params.location = location;
  
  const response = await api.get('/weather/forecast', { params });
  return response.data;
};

/**
 * Wetterwarnungen abrufen
 * @param {string} location Optional: Standort für den Warnungen abgerufen werden sollen
 * @returns {Promise} Wetterwarnungsdaten
 */
export const getWeatherAlerts = async (location = null) => {
  const params = location ? { location } : {};
  const response = await api.get('/weather/alerts', { params });
  return response.data;
};

/**
 * Standorte nach Eingabe suchen
 * @param {string} query Suchbegriff
 * @returns {Promise} Liste gefundener Standorte
 */
export const searchLocations = async (query) => {
  const response = await api.get('/weather/locations', { params: { query } });
  return response.data;
};

/**
 * Standardstandort des Benutzers aktualisieren
 * @param {string} location Standort der als Standard gespeichert werden soll
 * @param {number} lat Optional: Breitengrad des Standorts
 * @param {number} lon Optional: Längengrad des Standorts
 * @returns {Promise} Ergebnis der Aktualisierungsoperation
 */
export const updateDefaultLocation = async (location, lat = null, lon = null) => {
  const data = { defaultLocation: location };
  if (lat !== null && lon !== null) {
    data.lat = lat;
    data.lon = lon;
  }
  
  const response = await api.put('/weather/settings', data);
  return response.data;
};