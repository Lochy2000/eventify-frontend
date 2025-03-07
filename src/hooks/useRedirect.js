import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../contexts/CurrentUserContext";

export const useRedirect = (redirect) => {
    const currentUser = useCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect the user based on the redirect prop
        // if userAuthStatus is "loggedIn" and currentUser is not null, redirect to the home page
        // if userAuthStatus is "loggedOut" and currentUser is null, redirect to the sign-in page
        const handleRedirect = () => {
            if (userAuthStatus === "loggedIn" && currentUser) {
                navigate("/");
            } else if (userAuthStatus === "loggedOut" && !currentUser) {
                navigate("/signin");
            }
        };

        handleRedirect();
    }, [currentUser, navigate, redirect]);
};