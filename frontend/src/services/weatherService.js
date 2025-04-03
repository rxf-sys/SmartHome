import api from './api';

/**
 * Get current weather data for specified location or user's default
 * @param {string} location Optional: Location to get weather for
 * @returns {Promise} Weather data
 */
export const getCurrentWeather = async (location = null) => {
  const params = location ? { location } : {};
  const response = await api.get('/weather', { params });
  return response.data;
};

/**
 * Get weather forecast for next few days
 * @param {string} location Optional: Location to get forecast for
 * @param {number} days Optional: Number of days for forecast (default: 5)
 * @returns {Promise} Weather forecast data
 */
export const getWeatherForecast = async (location = null, days = 5) => {
  const params = { days };
  if (location) params.location = location;
  
  const response = await api.get('/weather/forecast', { params });
  return response.data;
};

/**
 * Update user's default weather location
 * @param {string} location Location to set as default
 * @returns {Promise} Result of update operation
 */
export const updateDefaultLocation = async (location) => {
  const response = await api.put('/weather/settings', { defaultLocation: location });
  return response.data;
};