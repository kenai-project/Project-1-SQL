import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const PrivateRoute = ({ roles, children }) => {
  const [user, setUser] = useState(() => AuthService.getCurrentUser());
  const [loading, setLoading] = useState(!user); // Skip loading if user is already available

  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
      };
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="text-center mt-5">Checking permissions...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.some(role => user.roles?.includes(role))) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PrivateRoute;
