import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios defaults
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  }

  // Load user from token
  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`);
      setUser(res.data);
    } catch (err) {
      console.error('Error loading user:', err.response?.data || err.message);
      localStorage.removeItem('token');
      setToken(null);
      delete axios.defaults.headers.common['x-auth-token'];
    }
    setLoading(false);
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      await loadUser();
      return true;
    } catch (err) {
      setError(err.response?.data.msg || 'Registrierung fehlgeschlagen');
      return false;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      await loadUser();
      return true;
    } catch (err) {
      setError(err.response?.data.msg || 'Login fehlgeschlagen');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['x-auth-token'];
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        register,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};