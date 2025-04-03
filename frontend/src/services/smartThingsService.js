import api from './api';

/**
 * Get all SmartThings devices for the current user
 * @returns {Promise} List of devices
 */
export const getDevices = async () => {
  const response = await api.get('/smartthings/devices');
  return response.data;
};

/**
 * Get device details
 * @param {string} deviceId ID of the device to get details for
 * @returns {Promise} Device details
 */
export const getDeviceDetails = async (deviceId) => {
  const response = await api.get(`/smartthings/devices/${deviceId}`);
  return response.data;
};

/**
 * Control a device
 * @param {string} deviceId ID of the device to control
 * @param {string} command Command to execute (e.g., 'setPower', 'setBrightness')
 * @param {any} value Value for the command
 * @returns {Promise} Result of the control operation
 */
export const controlDevice = async (deviceId, command, value) => {
  const response = await api.post(`/smartthings/devices/${deviceId}/control`, {
    command,
    value
  });
  return response.data;
};

/**
 * Get device history
 * @param {string} deviceId ID of the device
 * @param {Object} params Optional parameters (dateFrom, dateTo, limit)
 * @returns {Promise} Device history data
 */
export const getDeviceHistory = async (deviceId, params = {}) => {
  const response = await api.get(`/smartthings/devices/${deviceId}/history`, {
    params
  });
  return response.data;
};

/**
 * Connect SmartThings account
 * @param {Object} connectionData Connection data
 * @returns {Promise} Connection result
 */
export const connectAccount = async (connectionData) => {
  const response = await api.post('/smartthings/connect', connectionData);
  return response.data;
};

/**
 * Disconnect SmartThings account
 * @returns {Promise} Disconnection result
 */
export const disconnectAccount = async () => {
  const response = await api.delete('/smartthings/disconnect');
  return response.data;
};

/**
 * Create an automation rule
 * @param {Object} rule Rule definition
 * @returns {Promise} Created rule
 */
export const createRule = async (rule) => {
  const response = await api.post('/smartthings/rules', rule);
  return response.data;
};

/**
 * Update an automation rule
 * @param {string} ruleId ID of the rule to update
 * @param {Object} rule Updated rule definition
 * @returns {Promise} Updated rule
 */
export const updateRule = async (ruleId, rule) => {
  const response = await api.put(`/smartthings/rules/${ruleId}`, rule);
  return response.data;
};

/**
 * Delete an automation rule
 * @param {string} ruleId ID of the rule to delete
 * @returns {Promise} Deletion result
 */
export const deleteRule = async (ruleId) => {
  const response = await api.delete(`/smartthings/rules/${ruleId}`);
  return response.data;
};

/**
 * Get all automation rules
 * @returns {Promise} List of rules
 */
export const getRules = async () => {
  const response = await api.get('/smartthings/rules');
  return response.data;
};