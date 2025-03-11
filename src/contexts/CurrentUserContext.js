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
      // Try to fetch the current user using cookies
      const { data } = await axiosInstance.get("/auth/user/");
      console.log("Current user fetched:", data);
      setCurrentUser(data);
    } catch (err) {
      // If token is invalid or no user is logged in, just clear the state
      console.log("No user session found or session expired");
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