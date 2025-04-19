import axios from 'axios';
import Cookies from 'js-cookie'; // Make sure to install: npm install js-cookie

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

// Track refresh token attempts
let refreshTokenAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 2;

// Helper function to clear all auth cookies
const clearAuthCookies = () => {
  console.log('Clearing cookies');
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};


// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Log request (useful for debugging)
    console.log('Request:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    // Handle request errors
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response (useful for debugging)
    console.log('Response:', {
      status: response.status,
      data: response.data,
    });

    // You can transform the response data here if needed
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't exceeded max refresh attempts
    if (error.response?.status === 401 && refreshTokenAttempts < MAX_REFRESH_ATTEMPTS) {
      try {
        // Try to refresh the token
        refreshTokenAttempts++;
        const response = await api.post('/auth/refresh');
        
        return api(originalRequest);
      } catch (refreshError) {
        
        // If refresh failed, clear tokens and reject
        clearAuthCookies();
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    
    // If we've exceeded max refresh attempts, reset counter and clear cookies
    if (refreshTokenAttempts >= MAX_REFRESH_ATTEMPTS) {
      refreshTokenAttempts = 0;
      clearAuthCookies();
    }
    
    return Promise.reject(error);
  }
);

// Update clearToken method
api.clearToken = clearAuthCookies;

export default api; 