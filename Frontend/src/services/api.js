import axios from 'axios';
import { getStoredValidToken } from '../utils/token';

// Automatically normalize base URL so it always points to the backend /api prefix
const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

const defaultApiUrl = isLocalhost
  ? 'http://localhost:5000/api'
  : 'https://martpulse-65jl.onrender.com/api';

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || defaultApiUrl).trim();
const baseURL = rawBaseUrl.endsWith('/api')
  ? rawBaseUrl
  : rawBaseUrl.endsWith('/')
  ? `${rawBaseUrl}api`
  : `${rawBaseUrl}/api`;

const API = axios.create({
  baseURL,
  timeout: 60000, // 60 seconds to accommodate Render free-tier cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = getStoredValidToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    // Auto-retry once on network error / timeout to survive Render wakeups
    if (config && !config.__isRetry && (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response)) {
      config.__isRetry = true;
      console.warn('⚡ MartPulse API: Retrying request to wake up Render backend...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return API(config);
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('martpulse_token');
      localStorage.removeItem('martpulse_user');
      delete API.defaults.headers.common['Authorization'];
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('martpulse_auth_unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

// 1. AUTH API
export const authAPI = {
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  logout: async (tokenToRevoke) => {
    try {
      const activeToken = tokenToRevoke || localStorage.getItem('martpulse_token');
      const response = await API.post(
        '/auth/logout',
        { token: activeToken },
        activeToken ? { headers: { Authorization: `Bearer ${activeToken}` } } : {}
      );
      return response.data;
    } catch {
      return { success: true };
    }
  },

  changePassword: async (passwordData) => {
    const response = await API.post('/auth/change-password', passwordData);
    return response.data;
  },

  getProfile: async () => {
    const response = await API.get('/auth/profile');
    return response.data;
  },
};

// 2. STORE API
export const storeAPI = {
  getAllStores: async (params = {}) => {
    const response = await API.get('/stores', { params });
    return response.data;
  },

  createStore: async (storeData) => {
    const response = await API.post('/stores', storeData);
    return response.data;
  },
};

// 3. RATING API
export const ratingAPI = {
  submitRating: async (ratingData) => {
    const response = await API.post('/ratings', ratingData);
    return response.data;
  },

  updateRating: async (ratingId, ratingData) => {
    const response = await API.put(`/ratings/${ratingId}`, ratingData);
    return response.data;
  },

  getUserRatings: async () => {
    const response = await API.get('/ratings/my-ratings');
    return response.data;
  },
};

// 4. ADMIN API
export const adminAPI = {
  getStats: async () => {
    const response = await API.get('/admin/stats');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await API.get('/admin/users', { params });
    return response.data;
  },

  createUser: async (userData) => {
    const response = await API.post('/admin/users', userData);
    return response.data;
  },

  createStore: async (storeData) => {
    return storeAPI.createStore(storeData);
  },
};

// 5. OWNER API
export const ownerAPI = {
  getOwnerDashboard: async () => {
    const response = await API.get('/owner/dashboard');
    return response.data;
  },
};

export default API;
