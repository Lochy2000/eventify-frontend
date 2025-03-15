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
  withCredentials: true, // Include cookies in cross-origin requests
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
    

    // This is CRITICAL for file uploads to work properly
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('FormData detected - Content-Type header removed');
      
      // Also remove Accept header for multipart requests
      if (config.headers['Accept']) {
        delete config.headers['Accept'];
        console.log('Accept header removed for FormData request');
      }
      
      // Add multipart/form-data boundary header
      console.log('Setting multipart/form-data header for file upload');
      
      // Log FormData contents for debugging
      try {
        for (let [key, value] of config.data.entries()) {
          if (value instanceof File) {
            console.log(`FormData entry: ${key} = File (${value.name}, ${value.type}, ${value.size} bytes)`);
          } else {
            console.log(`FormData entry: ${key} = ${value}`);
          }
        }
      } catch (e) {
        console.error('Error logging FormData:', e);
      }
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
    if (error.message === 'Network Error') {
      console.error('CORS error: This is likely a Cross-Origin Resource Sharing (CORS) issue.');
      console.error('Check that your backend server is configured to accept requests from this origin.');
      console.error('Current origin:', window.location.origin);
    }
    console.error('Response error:', error.response?.status, error.message);
    
    // For file upload errors, log more details
    if (error.config?.data instanceof FormData) {
      console.error('Error during FormData/file upload request');
      console.error('Request URL:', error.config.url);
      console.error('Response data:', error.response?.data);
    }
    
    // If 401 Unauthorized, clear local storage and refresh
    if (error.response?.status === 401) {
      if (localStorage.getItem('authToken')) {
        console.log('Token expired or invalid, logging out...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
