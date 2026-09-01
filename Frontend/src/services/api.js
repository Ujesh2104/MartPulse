import axios from 'axios';

// Base Axios instance pointing directly to Express.js backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: automatically attaches JWT Bearer token to every outgoing request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('martpulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handles global response errors (like token expiration)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('martpulse_token');
      localStorage.removeItem('martpulse_user');
    }
    return Promise.reject(error);
  }
);

// ==========================================
// 1. AUTH API
// ==========================================
export const authAPI = {
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
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

// ==========================================
// 2. STORE API
// ==========================================
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

// ==========================================
// 3. RATING API
// ==========================================
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

// ==========================================
// 4. ADMIN API
// ==========================================
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

// ==========================================
// 5. OWNER API
// ==========================================
export const ownerAPI = {
  getOwnerDashboard: async () => {
    const response = await API.get('/owner/dashboard');
    return response.data;
  },
};

export default API;
