import axios from 'axios';

// API Base URL Configuration
// Priority: REACT_APP_API_BASE_URL environment variable (required in production)
// In development, use empty string to rely on proxy or localhost
const getApiBaseUrl = () => {
  // Always prefer environment variable if set
  if (process.env.REACT_APP_API_BASE_URL) {
    let url = process.env.REACT_APP_API_BASE_URL.trim();
    
    // Remove trailing slash if present
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    
    // Add https:// protocol if missing (but not if it's already http:// or https://)
    if (!url.match(/^https?:\/\//i)) {
      url = `https://${url}`;
    }
    
    return url;
  }
  
  // In production, environment variable is required
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ REACT_APP_API_BASE_URL environment variable is not set!');
    console.error('💡 Set it in Azure Static Web App → Configuration → Application settings');
    console.error('💡 Or in your build environment variables');
    // Return empty string to avoid breaking, but log the error
    return '';
  }
  
  // Development: use empty string to rely on proxy (from package.json)
  return '';
};

const API_BASE_URL = getApiBaseUrl();

// Log API configuration for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:', {
    baseURL: API_BASE_URL || '(using proxy from package.json)',
    nodeEnv: process.env.NODE_ENV,
    hasEnvVar: !!process.env.REACT_APP_API_BASE_URL,
    envVarValue: process.env.REACT_APP_API_BASE_URL || 'not set'
  });
} else if (process.env.NODE_ENV === 'production') {
  if (!API_BASE_URL) {
    console.error('⚠️ WARNING: No API base URL configured in production!');
  } else {
    console.log('🔧 API Configuration:', {
      baseURL: API_BASE_URL,
      nodeEnv: 'production',
      configured: true
    });
  }
}

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
  (response) => {
    // Check if response is HTML instead of JSON (common when API URL is wrong)
    const contentType = response.headers['content-type'] || '';
    if (contentType.includes('text/html') && typeof response.data === 'string' && response.data.trim().startsWith('<!')) {
      console.error('❌ Received HTML instead of JSON. This usually means the API URL is incorrect.');
      console.error('💡 Check that REACT_APP_API_BASE_URL is set correctly in Azure Static Web App settings');
      console.error('💡 Current baseURL:', API_BASE_URL);
      console.error('💡 Full request URL:', response.config?.url);
      throw new Error('API returned HTML instead of JSON. Check API base URL configuration.');
    }
    return response;
  },
  (error) => {
    // Check if error response is HTML
    if (error.response?.data && typeof error.response.data === 'string' && error.response.data.trim().startsWith('<!')) {
      console.error('❌ API Error: Received HTML instead of JSON');
      console.error('💡 This usually means the API base URL is incorrect');
      console.error('💡 Current baseURL:', API_BASE_URL);
      console.error('💡 Request URL:', error.config?.url);
      error.message = 'API returned HTML instead of JSON. Please check your API base URL configuration.';
    }
    
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