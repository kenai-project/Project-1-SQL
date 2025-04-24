import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Function to parse JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const AuthVerify = ({ logOut }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // On location change, check if the token is expired
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      const decodedJwt = parseJwt(user.accessToken);

      if (decodedJwt.exp * 1000 < Date.now()) {
        logOut(); // Log out if the token is expired
        navigate("/login"); // Redirect to login page
      }
    }
  }, [location, logOut, navigate]);

  return null;
};

export default AuthVerify;
