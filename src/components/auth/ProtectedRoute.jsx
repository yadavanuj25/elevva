// import React, { useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../auth/AuthContext";

// export default function ProtectedRoute({
//   children,
//   allowedModules = [],
//   allowedRoles = [],
//   allowedSubmodules = [],
// }) {
//   const { user, token, role, modules, setUser, logout } = useAuth();

//   // useEffect(() => {
//   //   if (!token) return;

//   //   const interval = setInterval(async () => {
//   //     try {
//   //       const res = await axios.get("/api/auth/check-lock", {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       });
//   //       if (res.data?.isLocked) {
//   //         setUser((prev) => ({ ...prev, isLocked: true }));
//   //         logout(); // Clears token, user, etc.
//   //       }
//   //     } catch (err) {
//   //       console.error("Lock check failed:", err);
//   //     }
//   //   }, 8000);

//   //   return () => clearInterval(interval);
//   // }, [token, setUser, logout]);

//   if (!token) return <Navigate to="/" replace />;
//   if (user?.isLocked) return <Navigate to="/lock-screen" replace />;
//   if (role?.toLowerCase() === "superadmin") return children;
//   if (
//     allowedRoles.length &&
//     !allowedRoles.some((r) => r.toLowerCase() === role?.toLowerCase())
//   ) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   const userModules = (modules || []).map((m) =>
//     typeof m === "string" ? m.toLowerCase() : m.name?.toLowerCase(),
//   );

//   if (
//     allowedModules.length &&
//     !allowedModules.some((am) => userModules.includes(am.toLowerCase()))
//   ) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   if (allowedSubmodules.length) {
//     const userSubmodules = (modules || [])
//       .flatMap((m) => m.submodules || [])
//       .map((s) =>
//         typeof s === "string" ? s.toLowerCase() : s.name?.toLowerCase(),
//       );

//     const hasSub = allowedSubmodules.some((sub) =>
//       userSubmodules.includes(sub.toLowerCase()),
//     );

//     if (!hasSub) return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// }

// Above is initial working  code

// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../auth/AuthContext";

// const ProtectedRoute = ({
//   children,
//   allowedRoles = [],
//   allowedModules = [],
// }) => {
//   const { token, user, role, modules } = useAuth();

//   // Check if user is authenticated
//   if (!token || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Check if user account is locked
//   if (user?.isLocked === true) {
//     return <Navigate to="/lock-screen" replace />;
//   }

//   // If allowedRoles is specified, check if user's role matches
//   if (allowedRoles.length > 0) {
//     const userRole = user?.role?.name || role;
//     const hasRole = allowedRoles.includes(userRole);

//     if (!hasRole) {
//       return <Navigate to="/unauthorized" replace />;
//     }
//   }

//   // If allowedModules is specified, check if user has access to any of them
//   if (allowedModules.length > 0) {
//     const userRole = user?.role?.name || role;

//     // Superadmin has access to everything
//     if (userRole === "superadmin") {
//       return children;
//     }

//     // Check if user has at least one of the allowed modules
//     const hasAccess = allowedModules.some((moduleName) => {
//       // Dashboard and settings are accessible to everyone
//       if (["dashboard", "settings"].includes(moduleName.toLowerCase())) {
//         return true;
//       }

//       // Check if user has this module in their permissions
//       return modules.some(
//         (m) => m.name?.toLowerCase() === moduleName.toLowerCase(),
//       );
//     });

//     if (!hasAccess) {
//       return <Navigate to="/unauthorized" replace />;
//     }
//   }

//   return children;
// };

// export default ProtectedRoute;

// Above is working code

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
