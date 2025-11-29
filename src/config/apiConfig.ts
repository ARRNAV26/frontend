// API Configuration - Environment-based URLs
const API_ENV = process.env.REACT_APP_API_ENV || 'production'; // Default to production

const API_ENDPOINTS = {
  development: {
    baseURL: 'http://localhost:8000',
    wsURL: 'ws://localhost:8000/ws',
  },
  production: {
    baseURL: 'https://yearling-ailee-arnavsaha26-08602565.koyeb.app',
    wsURL: 'wss://yearling-ailee-arnavsaha26-08602565.koyeb.app/ws',
  },
};

// Get current environment configuration
const getCurrentEnvConfig = () => {
  if (API_ENV === 'production') {
    return API_ENDPOINTS.production;
  }
  // Default to development
  return API_ENDPOINTS.development;
};

export const API_CONFIG = getCurrentEnvConfig();

// Environment information
export const API_ENVIRONMENT = API_ENV;
export const isProduction = API_ENV === 'production';
// export const isDevelopment = API_ENV === 'development';

// Usage instructions:
// Set REACT_APP_API_ENV=production in your deployment environment
// No env var or 'development' → localhost endpoints
// REACT_APP_API_ENV=production → Koyeb endpoints

export default API_CONFIG;
