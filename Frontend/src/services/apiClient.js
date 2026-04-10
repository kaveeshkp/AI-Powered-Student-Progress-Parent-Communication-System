import axios from 'axios';
import { handleAPIError } from './errorHandler';

/**
 * Axios Instance with Error Handling
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Adds token to requests
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common error cases
 */
api.interceptors.response.use(
  (response) => {
    return response.data; // Return just the data
  },
  (error) => {
    const apiError = handleAPIError(error);

    // Handle specific status codes
    if (apiError.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(apiError);
  }
);

export default api;
