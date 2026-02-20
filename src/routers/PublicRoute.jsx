import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const PublicRoute = ({ children }) => {
  const { token, user } = useAuth();

  // If user is authenticated and not locked, redirect to dashboard
  if (token && user && !user?.isLocked) {
    const dashboardPath = "/dashboard";
    return <Navigate to={dashboardPath} replace />;
  }
  // If user is locked, allow access to lock screen
  if (user?.isLocked) {
    return children;
  }
  // Allow access to public routes (login, forgot password, etc.)
  return children;
};

export default PublicRoute;
