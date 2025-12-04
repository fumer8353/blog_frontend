const config = {
  // API Configuration
  API_URL: process.env.REACT_APP_API_BASE_UR || '/api',

  API_CONFIG: {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  },

  AUTH_TOKEN_KEY: 'auth_token',

  getAuthHeader: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  ENABLE_LOGGING: true,
  ENV: process.env.NODE_ENV || 'development',

  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    AUTH_ERROR: 'Authentication failed. Please log in again.',
    SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  }
};

if (config.ENV === 'development' && config.ENABLE_LOGGING) {
  console.log('Current configuration:', config);
}

export default config;
