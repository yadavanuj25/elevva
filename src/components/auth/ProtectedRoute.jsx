import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
export default function ProtectedRoute({
  children,
  allowedModules = [],
  allowedRoles = [],
  allowedSubmodules = [],
}) {
  const { user, token, role, modules } = useAuth();
  if (!token) return <Navigate to="/" replace />;
  if (user?.isLocked) return <Navigate to="/lock-screen" replace />;
  if (role?.toLowerCase() === "superadmin") return children;
  if (
    allowedRoles.length &&
    !allowedRoles.some((r) => r.toLowerCase() === role?.toLowerCase())
  ) {
    return <Navigate to="/unauthorized" replace />;
  }
  const userModules = (modules || []).map((m) =>
    typeof m === "string" ? m.toLowerCase() : m.name?.toLowerCase()
  );
  if (
    allowedModules.length &&
    !allowedModules.some((am) => userModules.includes(am.toLowerCase()))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }
  if (allowedSubmodules.length) {
    const userSubmodules = (modules || [])
      .flatMap((m) => m.submodules || [])
      .map((s) =>
        typeof s === "string" ? s.toLowerCase() : s.name?.toLowerCase()
      );

    const hasSub = allowedSubmodules.some((sub) =>
      userSubmodules.includes(sub.toLowerCase())
    );

    if (!hasSub) return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
