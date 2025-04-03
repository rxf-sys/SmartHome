import api from './api';

/**
 * Alle Dashboard-Daten auf einmal abrufen
 * @returns {Promise} Objekt mit Wetter-, Banking- und SmartThings-Daten
 */
export const getDashboardData = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};