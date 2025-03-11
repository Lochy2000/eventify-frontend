// import axios from 'axios';

// // Axios instance with base URL
// const axiosInstance = axios.create({
//     baseURL: 'https://eventify-back-d016873ba1b8.herokuapp.com/api',
//     timeout: 5000,
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//     },
// });

// // Tell axios which cookie to read for CSRF and which header to send it in
// axiosInstance.defaults.xsrfCookieName = 'csrftoken';
// axiosInstance.defaults.xsrfHeaderName = 'X-CSRFToken';

// // Request interceptor to attach the auth token to requests
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('accessToken');
//         if (token) {
//             // Check if token appears to be JWT (contains dots) or simple token
//             if (token.includes('.')) {
//                 // JWT token
//                 config.headers.Authorization = `Bearer ${token}`;
//             } else {
//                 // Token authentication
//                 config.headers.Authorization = `Token ${token}`;
//             }
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Response interceptor to refresh the token on receiving a 401 error
// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;
        
//         // If the error is 401 and we haven't tried to refresh the token yet
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
            
//             try {
//                 const refreshToken = localStorage.getItem('refreshToken');
                
//                 // If we have a refresh token, try to get a new access token
//                 if (refreshToken) {
//                     const response = await axios.post(
//                         'https://eventify-back-d016873ba1b8.herokuapp.com/api/auth/token/refresh/',
//                         { refresh: refreshToken }
//                     );
                    
//                     if (response.data.access) {
//                         // Store the new access token
//                         localStorage.setItem('accessToken', response.data.access);
                        
//                         // Update the Authorization header for the original request
//                         originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                        
//                         // Retry the original request
//                         return axiosInstance(originalRequest);
//                     }
//                 }
//             } catch (refreshError) {
//                 console.error('Error refreshing token:', refreshError);
                
//                 // Clear tokens and redirect to login if in browser environment
//                 localStorage.removeItem('accessToken');
//                 localStorage.removeItem('refreshToken');
//                 if (typeof window !== 'undefined') {
//                     window.location.href = '/signin';
//                 }
//             }
//         }
        
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;