import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ProtectedRoute = ({ children, resource, action }) => {
  const { token, user, permissions } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role?.name === "superadmin") {
    return children;
  }

  if (resource && action) {
    const allowed = permissions?.[resource]?.includes(action);
    if (!allowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext";

// const ProtectedRoute = ({ children, resource, action, requiredRole }) => {
//   const { isAuthenticated, user, can } = useAuth();
//   const location = useLocation();

//   // ── Not logged in ─────────────────────────────────────────────────────────
//   if (!isAuthenticated) {
//     // Preserve the attempted URL so we can redirect back after login
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // ── Locked account ────────────────────────────────────────────────────────
//   if (user?.isLocked) {
//     return <Navigate to="/locked" replace />;
//   }

//   // ── Role check ────────────────────────────────────────────────────────────
//   if (requiredRole && user?.role?.name !== requiredRole) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // ── Permission check (uses the can() helper from context) ─────────────────
//   if (resource && action && !can(resource, action)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
