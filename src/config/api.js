// API configuration
const ENV = process.env.REACT_APP_ENV || 'development';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// Log API configuration in development
if (ENV === 'development') {
  console.log('API Configuration:', {
    baseURL: API_BASE_URL,
    environment: ENV
  });
}

const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
};

// Add environment-specific headers
if (ENV === 'production') {
  apiConfig.headers['X-Environment'] = 'production';
}

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getApiConfig = () => {
  return {
    ...apiConfig,
    headers: {
      ...apiConfig.headers,
      ...getAuthHeader()
    }
  };
};

export default apiConfig;
