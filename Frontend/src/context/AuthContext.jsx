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

  // Sync state changes with localStorage
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
      throw new Error(response.message || 'Login failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password';
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
      throw new Error(response.message || 'Registration failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('martpulse_token');
    localStorage.removeItem('martpulse_user');
  };

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    try {
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      return { success: true, message: res.message || 'Password updated successfully' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update password';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    role: user?.role,
    loading,
    authError,
    setAuthError,
    login,
    register,
    logout,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
