// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../auth/AuthContext";

// const ProtectedRoute = ({ children, resource, action }) => {
//   const { token, user, permissions, loading } = useAuth();
//   if (loading) return null;
//   if (!token || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (user?.role?.name === "admin") {
//     return children;
//   }

//   if (resource && action) {
//     const allowed = permissions?.[resource]?.includes(action);

//     if (!allowed) {
//       return <Navigate to="/unauthorized" replace />;
//     }
//   }
//   return children;
// };

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const ProtectedRoute = ({ children, resource, action }) => {
  const { token, user, permissions } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Super Admin Full Access
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
