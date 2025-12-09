import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function PublicRoute({ children }) {
  const { user, token, role } = useAuth();
  if (token && !user?.isLocked) {
    const userRole = role?.toLowerCase();
    if (userRole === "superadmin" || userRole === "admin") {
      return <Navigate to="/admin/super-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }
  return children;
}
