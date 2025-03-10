import { createContext, useContext, useEffect, useState, useMemo } from "react";
import axiosInstance from "../services/api";
import { useNavigate } from "react-router-dom";
import { removeTokenTimeStamp, shouldRefreshToken } from "../utils/utils";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleMount = async () => {
    try {
      // Check if we have a token in localStorage
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Fetch the current user data
        const { data } = await axiosInstance.get("/auth/user/");
        setCurrentUser(data);
      }
    } catch (err) {
      // If token is invalid, clear everything
      console.error(err);
      localStorage.removeItem('accessToken');
      removeTokenTimeStamp();
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useMemo(() => {
    // Check if token needs refreshing
    const refreshToken = async () => {
      try {
        if (shouldRefreshToken()) {
          const { data } = await axiosInstance.post("/auth/token/refresh/");
          if (data.access) {
            localStorage.setItem('accessToken', data.access);
          }
        }
      } catch (err) {
        // If refresh fails, log out user
        setCurrentUser(null);
        removeTokenTimeStamp();
        localStorage.removeItem('accessToken');
        navigate("/signin");
      }
    };

    const interval = setInterval(refreshToken, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};