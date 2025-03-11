// axiosDefaults.js
import axios from 'axios';

// Use environment-based URL when possible
const BASE_URL = process.env.REACT_APP_API_URL || 'https://eventify-back-d016873ba1b8.herokuapp.com/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  withCredentials: true, // ensures cookies are sent with requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to fetch CSRF token if needed
axiosInstance.interceptors.request.use(
  async (config) => {
    // Only get CSRF token for non-GET methods
    if (!['get', 'head', 'options'].includes(config.method)) {
      try {
        // Get CSRF cookie before the actual request
        await axios.get(`${BASE_URL}/csrf/`, { withCredentials: true });
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
