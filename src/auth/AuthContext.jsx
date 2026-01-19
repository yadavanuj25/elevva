// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// const PERMISSION_MAP = {
//   "6902f14821ac553ab13fa9a5": "dashboard",
//   "6902f14821ac553ab13fa9a6": "users",
//   "6902f14821ac553ab13fa9a7": "roles",
//   "6902f14821ac553ab13fa9a8": "reports",
//   "6902f14821ac553ab13fa9a9": "settings",
//   "6902f14821ac553ab13fa9aa": "profiles",
//   "6902f14821ac553ab13fa9ab": "sales",
//   "6902f14821ac553ab13fa9ac": "hr",
//   "6902f14821ac553ab13fa9ad": "bde",
//   "6902f14821ac553ab13fa9ae": "analytics",
//   "6902f14821ac553ab13fa9af": "support",
//   "6902f14821ac553ab13fa9b0": "leads",
// };

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [loggingOut, setLoggingOut] = useState(false);
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user") || "null"),
//   );
//   const [isLocked, setIsLocked] = useState(
//     JSON.parse(localStorage.getItem("isLocked") || "false"),
//   );
//   const [role, setRole] = useState(localStorage.getItem("role") || "");
//   const [modules, setModules] = useState(
//     JSON.parse(localStorage.getItem("modules") || "[]"),
//   );

//   useEffect(() => {
//     token
//       ? localStorage.setItem("token", token)
//       : localStorage.removeItem("token");

//     user
//       ? localStorage.setItem("user", JSON.stringify(user))
//       : localStorage.removeItem("user");

//     role ? localStorage.setItem("role", role) : localStorage.removeItem("role");

//     modules?.length
//       ? localStorage.setItem("modules", JSON.stringify(modules))
//       : localStorage.removeItem("modules");
//   }, [token, user, role, modules]);

//   const login = (data) => {
//     const { token, user } = data;
//     setToken(token);
//     setUser(user);
//     setIsLocked(user?.isLocked || false);
//     localStorage.setItem("isLocked", JSON.stringify(user?.isLocked || false));
//     setRole(user?.role?.name || user?.role || "");
//     if (user?.role?.permissions?.length) {
//       const formattedModules = user.role.permissions.map((permId) => ({
//         id: permId,
//         name: PERMISSION_MAP[permId] || permId,
//       }));
//       setModules(formattedModules);
//     } else {
//       setModules([]);
//     }
//   };

//   const logout = async () => {
//     try {
//       setLoggingOut(true);
//       await fetch("https://crm-backend-qbz0.onrender.com/api/auth/logout", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setToken(null);
//       setUser(null);
//       setRole("");
//       setModules([]);
//       setIsLocked(false);
//       localStorage.clear();
//       return true;
//     } catch (error) {
//       console.error("Logout error:", error);
//       return false;
//     } finally {
//       setLoggingOut(false);
//     }
//   };

//   const lockScreen = async () => {
//     try {
//       const res = await axios.post(
//         "https://crm-backend-qbz0.onrender.com/api/auth/lock-screen",
//         {},
//         { headers: { Authorization: `Bearer ${token}` } },
//       );

//       if (res.data.success) {
//         setIsLocked(true);
//         localStorage.setItem("isLocked", "true");
//         setUser(res.data.user);
//         localStorage.setItem("user", JSON.stringify(res.data.user));
//       }
//     } catch (error) {
//       console.error("Lock failed", error);
//     }
//   };

//   const unlockScreen = async (password) => {
//     try {
//       const response = await fetch(
//         "https://crm-backend-qbz0.onrender.com/api/auth/unlock-screen",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ password }),
//         },
//       );
//       const data = await response.json();
//       if (data.success) {
//         const updatedUser = data.user || { ...user, isLocked: false };
//         setUser(updatedUser);
//         setIsLocked(false);

//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         localStorage.setItem("isLocked", "false");

//         return { success: true };
//       }

//       return { success: false };
//     } catch (error) {
//       console.error("Unlock error:", error);
//       return { success: false };
//     }
//   };

//   // useEffect(() => {
//   //   if (!token || !user) return;

//   //   const interval = setInterval(async () => {
//   //     try {
//   //       const res = await fetch(
//   //         "https://crm-backend-qbz0.onrender.com/api/auth/me",
//   //         {
//   //           headers: { Authorization: `Bearer ${token}` },
//   //         }
//   //       );
//   //       const data = await res.json();
//   //       if (res.ok && data.user) {
//   //         const backendLocked = data.user.isLocked;

//   //         if (backendLocked !== isLocked) {
//   //           setIsLocked(backendLocked);
//   //           localStorage.setItem("isLocked", JSON.stringify(backendLocked));
//   //         }

//   //         setUser(data.user);
//   //         localStorage.setItem("user", JSON.stringify(data.user));
//   //       }
//   //     } catch (err) {
//   //       console.error("Polling error:", err);
//   //     }
//   //   }, 8000);

//   //   return () => clearInterval(interval);
//   // }, [token, user, isLocked]);

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         user,
//         setUser,
//         role,
//         modules,
//         login,
//         logout,
//         isLocked,
//         lockScreen,
//         unlockScreen,
//         loggingOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
// Convert backend permissions → { users: ["read","create"] }
const normalizePermissions = (permissions = []) => {
  return permissions.reduce((acc, { resource, action }) => {
    if (!acc[resource]) acc[resource] = [];
    acc[resource].push(action);
    return acc;
  }, {});
};
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [permissions, setPermissions] = useState(
    JSON.parse(localStorage.getItem("permissions") || "{}"),
  );
  const login = (response) => {
    const { token, user } = response;
    setToken(token);
    setUser(user);
    const normalizedPermissions = normalizePermissions(
      user?.role?.permissions || [],
    );
    setPermissions(normalizedPermissions);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("permissions", JSON.stringify(normalizedPermissions));
    navigate("/dashboard");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPermissions({});
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: user?.role?.name,
        permissions,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
