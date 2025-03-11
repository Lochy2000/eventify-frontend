// axiosDefaults.js
import axios from 'axios';

// Base URL config
const BASE_URL = process.env.REACT_APP_API_URL || 'https://eventify-back-d016873ba1b8.herokuapp.com/api';

// Create axios instance with config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add token to request headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    console.log(`Sending ${config.method?.toUpperCase() || 'GET'} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.message);
    
    // If 401 Unauthorized, clear local storage and refresh
    if (error.response?.status === 401) {
      if (localStorage.getItem('authToken')) {
        console.log('Token expired or invalid, logging out...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Optional: redirect to login
        // window.location.href = '/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
