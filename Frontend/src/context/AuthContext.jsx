import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API, { authAPI } from '../services/api';
import {
  getStoredValidToken,
  getStoredValidUser,
  isTokenExpired,
  getTokenRemainingTimeMs,
} from '../utils/token';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredValidUser());
  const [token, setToken] = useState(() => getStoredValidToken());
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const clearAuth = useCallback(() => {
    try {
      localStorage.removeItem('martpulse_token');
      localStorage.removeItem('martpulse_user');
      sessionStorage.removeItem('martpulse_token');
      sessionStorage.removeItem('martpulse_user');
    } catch {}
    delete API.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setAuthError(null);
  }, []);

  const logout = useCallback(() => {
    const currentToken = getStoredValidToken() || token;
    // 1. Instantly clear all tokens and user data locally
    clearAuth();
    // 2. Notify backend to revoke and expire the token on server
    if (currentToken) {
      authAPI.logout(currentToken).catch(() => {});
    }
  }, [clearAuth, token]);



  // Real-time automatic token expiration timer
  useEffect(() => {
    if (!token) return;
    const remainingMs = getTokenRemainingTimeMs(token);
    if (remainingMs <= 0) {
      clearAuth();
      return;
    }

    const timer = setTimeout(() => {
      console.warn('⚡ MartPulse Auth: Token reached expiration timestamp. Logging out...');
      clearAuth();
    }, remainingMs);

    return () => clearTimeout(timer);
  }, [token, clearAuth]);

  // Heartbeat & focus token validity checks
  useEffect(() => {
    const handleCheckToken = () => {
      const storedToken = getStoredValidToken();
      if (!storedToken && token) {
        clearAuth();
      }
    };

    window.addEventListener('focus', handleCheckToken);
    window.addEventListener('popstate', handleCheckToken);

    // Periodic heartbeat check every 5 seconds to purge expired tokens
    const interval = setInterval(handleCheckToken, 5000);

    return () => {
      window.removeEventListener('focus', handleCheckToken);
      window.removeEventListener('popstate', handleCheckToken);
      clearInterval(interval);
    };
  }, [token, clearAuth]);

  // Inactivity / Idle Auto-Expiry (Auto-logout if user is inactive on screen for 5 minutes)
  useEffect(() => {
    if (!token) return;

    let idleTimer;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        console.warn('⚡ MartPulse Auth: User inactive. Auto-expiring token and logging out...');
        clearAuth();
      }, 5 * 60 * 1000); // 5 minutes inactivity
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, resetIdleTimer, { passive: true }));
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach((ev) => window.removeEventListener(ev, resetIdleTimer));
    };
  }, [token, clearAuth]);

  // Listen for 401 unauthorized events emitted by API interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuth();
    };

    window.addEventListener('martpulse_auth_unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('martpulse_auth_unauthorized', handleUnauthorized);
    };
  }, [clearAuth]);

  // Verify session on initial app load if token exists
  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      const storedToken = getStoredValidToken();
      if (storedToken) {
        try {
          const profile = await authAPI.getProfile();
          if (isMounted && profile && profile.user) {
            setUser(profile.user);
            localStorage.setItem('martpulse_user', JSON.stringify(profile.user));
          }
        } catch (err) {
          if (isMounted) {
            clearAuth();
          }
        }
      } else {
        if (isMounted) {
          clearAuth();
        }
      }
    };

    verifySession();
    return () => {
      isMounted = false;
    };
  }, [clearAuth]);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await authAPI.login({ email, password });
      if (response && response.token && response.user) {
        localStorage.setItem('martpulse_token', response.token);
        localStorage.setItem('martpulse_user', JSON.stringify(response.user));
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
        localStorage.setItem('martpulse_token', response.token);
        localStorage.setItem('martpulse_user', JSON.stringify(response.user));
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
