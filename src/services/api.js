import axios from 'axios';
import Cookies from 'js-cookie'; // Make sure to install: npm install js-cookie

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
console.log("error",error);

    return Promise.reject(error);
  }
);



api.clearToken = () => {
  Cookies.remove('token');
};

export default api; 