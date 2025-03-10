import axios from 'axios';

// Axios instance with base.url
const axiosInstance = axios.create({
    //direct url to backend
    baseURL: 'https://eventify-back-d016873ba1b8.herokuapp.com/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
    },
});

// Request interceptor to attach the auth token to requests 

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearere ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to refresh the token on receiving a 401 error

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async  (error) => {
        return Promise.reject(error);
    }

);
export default axiosInstance;