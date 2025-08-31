// API Configuration
const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api',
  
  // App Configuration
  appName: process.env.REACT_APP_NAME || 'Sports Booking',
  appVersion: process.env.REACT_APP_VERSION || '1.0.0',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  
  // Features
  enableDebug: process.env.REACT_APP_ENABLE_DEBUG === 'true',
  enableConsoleLogs: process.env.REACT_APP_ENABLE_CONSOLE_LOGS === 'true',
  
  // Cache Configuration
  cacheDuration: parseInt(process.env.REACT_APP_CACHE_DURATION) || 15000,
  walletCacheDuration: parseInt(process.env.REACT_APP_WALLET_CACHE_DURATION) || 15000,
  
  // UI Configuration
  itemsPerPage: parseInt(process.env.REACT_APP_ITEMS_PER_PAGE) || 10,
  autoLogoutTime: parseInt(process.env.REACT_APP_AUTO_LOGOUT_TIME) || 3600000
};

export default config;
