import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('martpulse_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('martpulse_token'));
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('martpulse_token', token);
    } else {
      localStorage.removeItem('martpulse_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('martpulse_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('martpulse_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await authAPI.login({ email, password });
      if (response && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        return { success: true, user: response.user };
      }
      throw new Error(response?.message || 'Login failed');
    } catch (err) {
      let msg = 'Invalid email or password. Please check your credentials.';
      if (err.response?.status === 400 || err.response?.status === 401) {
        msg = err.response?.data?.message || 'Invalid email or password.';
      } else if (err.response?.status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
        msg = 'Unable to reach backend server. Please verify backend connection.';
      } else if (err.response?.data?.message && !err.response.data.message.includes('Route')) {
        msg = err.response.data.message;
      }
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await authAPI.register(userData);
      if (response && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        return { success: true, user: response.user };
      }
      throw new Error(response?.message || 'Registration failed');
    } catch (err) {
      let msg = 'Registration failed. Please check the entered details.';
      if (err.response?.status === 400 || err.response?.status === 409) {
        msg = err.response?.data?.message || 'A user with this email already exists.';
      } else if (err.response?.status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
        msg = 'Unable to reach backend server. Please verify backend connection.';
      } else if (err.response?.data?.message && !err.response.data.message.includes('Route')) {
        msg = err.response.data.message;
      }
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword({ currentPassword, newPassword });
      return { success: true, message: response.message };
    } catch (err) {
      let msg = 'Failed to update password. Please verify your current password.';
      if (err.response?.data?.message && !err.response.data.message.includes('Route')) {
        msg = err.response.data.message;
      }
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthError(null);
    localStorage.removeItem('martpulse_token');
    localStorage.removeItem('martpulse_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        login,
        register,
        changePassword,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
