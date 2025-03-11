import { createContext, useContext, useEffect, useState, useMemo } from "react";
import axiosInstance from "../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import { removeTokenTimeStamp, shouldRefreshToken } from "../utils/utils";

// Create context to store the current user and set current user
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

// Custom hooks to use the current user and set current user
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// Provider component to wrap the app and provide the current user
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleMount = async () => {
    try {
      // Check if we have a user in localStorage
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');
      
      if (storedUser && token) {
        // If we have stored user data, use it
        setCurrentUser(JSON.parse(storedUser));
        
        // Verify the user data with the server in the background
        try {
          const { data } = await axiosInstance.get("/auth/user/");
          setCurrentUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        } catch (serverErr) {
          // If token is invalid, clear storage
          console.log('Stored token invalid, clearing user data');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setCurrentUser(null);
        }
      } else {
        // No stored user, set to null
        setCurrentUser(null);
      }
    } catch (err) {
      // If any error occurs during user verification, clear everything
      console.error("Error in user authentication:", err);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

    // Set up token refresh interval
  useEffect(() => {
    // Skip if no user is logged in
    if (!currentUser) return;
    
    // Function to refresh the token
    const refreshToken = async () => {
      try {
        // Try to refresh the token
        await axiosInstance.post("/auth/token/refresh/");
        console.log("Token refreshed successfully");
      } catch (err) {
        console.error("Token refresh failed:", err);
        // If refresh fails, log out user
        setCurrentUser(null);
        navigate("/signin");
      }
    };

    // Set interval to refresh token every 55 minutes (tokens last 60 minutes)
    const interval = setInterval(refreshToken, 55 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentUser, navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};