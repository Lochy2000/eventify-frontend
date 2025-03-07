import { jwtDecode } from "jwt-decode"; 

export const setTokenTimeStamp = (data) => {
    const refreshTokenTimeStamp = jwtDecode(data?.refresh_token).exp;
    localStorage.setItem("refreshTokenTimeStamp", refreshTokenTimeStamp);
};

export const shouldRefreshToken = () => {
    return !!localStorage.getItem("refreshTokenTimeStamp");
};

export const removeTokenTimeStamp = () => {
    localStorage.removeItem("refreshTokenTimeStamp");
};