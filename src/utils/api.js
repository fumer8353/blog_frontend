import axios from 'axios';

// In production, use the Azure App Service backend URL
// In development, use empty string to rely on proxy or localhost
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://blog-backend-c6fvc7d5c2dfbkg7.canadacentral-01.azurewebsites.net'
    : '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  // Add timeout for production
  timeout: process.env.NODE_ENV === 'production' ? 10000 : 0,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Add error logging for production
    if (process.env.NODE_ENV === 'production') {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

export default api; 