import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <div>Loading...</div>; // swap for a spinner component if you have one
  }

  if (status === "unauthenticated" || !user) {
    // remember where they were trying to go, so you can send them back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;