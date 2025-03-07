import { createContext, use, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useNavigate } from "react-router-dom";

const CurrentUserContext = createContext();
const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const handlemount = async () => {
        try {
            const data = await axiosReq.get("/auth/user/");
            setCurrentUser(data);
        } catch (error) {
            console.error(error);
        } 
    };
    useEffect(() => {
        handlemount();
    }, []);

    useMemo(() => {
        axiosReq.interceptors.request.use(
          async (config) => {
            try {
              await axios.post("/api/token/refresh/");
            } catch (err) {
              setCurrentUser((prevCurrentUser) => {
                if (prevCurrentUser) {
                  navigate("/signin");
                }
                return null;
              });
              return config;
            }
            return config;
          },
          (err) => {
            return Promise.reject(err);
          }
        );
        
        axiosRes.interceptors.response.use(
            (response) => response,
            async (err) => {
                if (err.response?.status === 401) {
                try {
                    await axios.post("/api/token/refresh/");
                } catch (err) {
                    setCurrentUser((prevCurrentUser) => {
                    if (prevCurrentUser) {
                        navigate("/signin");
                    }
                    return null;
                    });
                }
                return axios(err.config);
                }
                return Promise.reject(err);
            }
            );
    }, [navigate]); 

    return (
        <CurrentUserContext.Provider value={currentUser}>
          <SetCurrentUserContext.Provider value={setCurrentUser}>
            {children}
          </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
      );
}
