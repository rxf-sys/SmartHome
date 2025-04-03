import api from './api';

/**
 * Get all bank accounts for the current user
 * @returns {Promise} List of bank accounts
 */
export const getAccounts = async () => {
  const response = await api.get('/banking/accounts');
  return response.data;
};

/**
 * Get account details for a specific account
 * @param {string} accountId ID of the account to get details for
 * @returns {Promise} Account details
 */
export const getAccountDetails = async (accountId) => {
  const response = await api.get(`/banking/accounts/${accountId}`);
  return response.data;
};

/**
 * Get transactions for a specific account
 * @param {string} accountId ID of the account
 * @param {Object} params Optional parameters (dateFrom, dateTo, limit)
 * @returns {Promise} List of transactions
 */
export const getTransactions = async (accountId, params = {}) => {
  const response = await api.get(`/banking/accounts/${accountId}/transactions`, { params });
  return response.data;
};

/**
 * Initiate a bank connection for a new account
 * @param {Object} connectionData Data for connecting to the bank
 * @returns {Promise} Connection result
 */
export const initiateConnection = async (connectionData) => {
  const response = await api.post('/banking/connect', connectionData);
  return response.data;
};

/**
 * Remove a bank connection
 * @param {string} connectionId ID of the connection to remove
 * @returns {Promise} Result of the removal operation
 */
export const removeConnection = async (connectionId) => {
  const response = await api.delete(`/banking/connections/${connectionId}`);
  return response.data;
};

/**
 * Update banking settings
 * @param {Object} settings Settings to update
 * @returns {Promise} Updated settings
 */
export const updateSettings = async (settings) => {
  const response = await api.put('/banking/settings', settings);
  return response.data;
};