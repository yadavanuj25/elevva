// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../auth/AuthContext";

// export default function PublicRoute({ children }) {
//   const { user, token, role } = useAuth();
//   if (token && !user?.isLocked) {
//     const userRole = role?.toLowerCase();
//     if (userRole === "superadmin" || userRole === "admin") {
//       return <Navigate to="/admin/super-dashboard" replace />;
//     } else {
//       return <Navigate to="/dashboard" replace />;
//     }
//   }
//   return children;
// }

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const PublicRoute = ({ children }) => {
  const { token, user } = useAuth();

  // If user is authenticated and not locked, redirect to dashboard
  if (token && user && !user?.isLocked) {
    const role = user?.role?.name;
    const dashboardPath =
      role === "admin" ? "/admin/super-dashboard" : "/dashboard";
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
