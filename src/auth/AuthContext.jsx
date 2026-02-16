import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

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
  const [isLocked, setIsLocked] = useState(
    JSON.parse(localStorage.getItem("isLocked") || "false"),
  );
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

  const lockScreen = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/lock-screen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data.success) {
        setIsLocked(true);
        localStorage.setItem("isLocked", "true");

        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (error) {
      console.error("Lock failed", error);
    }
  };

  const unlockScreen = async (password) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/unlock-screen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser = data.user || { ...user, isLocked: false };

        setUser(updatedUser);
        setIsLocked(false);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("isLocked", "false");
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Unlock error:", error);
      return { success: false };
    }
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
        isLocked,
        lockScreen,
        unlockScreen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Below is old code

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
//       await fetch("http://localhost:5000/api/auth/logout", {
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
//         "http://localhost:5000/api/auth/lock-screen",
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
//         "http://localhost:5000/api/auth/unlock-screen",
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
//   //         "http://localhost:5000/api/auth/me",
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

/**
 * AuthContext.jsx  (final — includes API 401 listener)
 *
 * Drop-in for the previous version. Key additions vs the base file:
 *   - Listens for the "auth:unauthorized" event fired by apiClient.js
 *     so any 401 from ANY API call auto-triggers logout.
 */

// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
// } from "react";
// import { useNavigate } from "react-router-dom";

// // ─── Context ──────────────────────────────────────────────────────────────────

// const AuthContext = createContext(null);

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
//   return ctx;
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const buildPermissionMap = (permissions = []) =>
//   permissions.reduce((acc, { resource, action }) => {
//     if (!acc[resource]) acc[resource] = new Set();
//     acc[resource].add(action);
//     return acc;
//   }, {});

// const decodeJwtPayload = (token) => {
//   try {
//     const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
//     return JSON.parse(atob(base64));
//   } catch {
//     return null;
//   }
// };

// const isTokenExpired = (token) => {
//   if (!token) return true;
//   const payload = decodeJwtPayload(token);
//   if (!payload?.exp) return true;
//   return Date.now() / 1000 >= payload.exp - 30; // 30-second buffer
// };

// // ─── Storage ──────────────────────────────────────────────────────────────────
// //
// // Token   → sessionStorage  (cleared on tab/browser close; not shared across
// //                            tabs; still XSS-vulnerable — for max security use
// //                            an httpOnly cookie set by your backend)
// // User    → sessionStorage  (non-sensitive profile re-hydration on F5)
// // Perms   → in-memory only  (derived from user object; never persisted)

// const KEY_TOKEN = "auth_token";
// const KEY_USER = "auth_user";

// const persistSession = (token, user) => {
//   sessionStorage.setItem(KEY_TOKEN, token);
//   sessionStorage.setItem(KEY_USER, JSON.stringify(user));
// };

// const clearSession = () => {
//   sessionStorage.removeItem(KEY_TOKEN);
//   sessionStorage.removeItem(KEY_USER);
// };

// const readSession = () => {
//   const token = sessionStorage.getItem(KEY_TOKEN);
//   try {
//     const user = JSON.parse(sessionStorage.getItem(KEY_USER));
//     return { token, user };
//   } catch {
//     return { token, user: null };
//   }
// };

// // ─── Provider ─────────────────────────────────────────────────────────────────

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();

//   // ── State (hydrated from sessionStorage on mount) ─────────────────────────

//   const [token, setToken] = useState(() => {
//     const { token } = readSession();
//     return isTokenExpired(token) ? null : token;
//   });

//   const [user, setUser] = useState(() => {
//     const { token, user } = readSession();
//     return isTokenExpired(token) ? null : user;
//   });

//   const [permissions, setPermissions] = useState(() => {
//     const { token, user } = readSession();
//     if (isTokenExpired(token) || !user) return {};
//     return buildPermissionMap(user?.role?.permissions ?? []);
//   });

//   // ── Auto-logout timer ─────────────────────────────────────────────────────

//   const timerRef = useRef(null);

//   const clearTimer = () => {
//     if (timerRef.current) clearTimeout(timerRef.current);
//   };

//   const scheduleAutoLogout = useCallback((jwtToken) => {
//     clearTimer();
//     const payload = decodeJwtPayload(jwtToken);
//     if (!payload?.exp) return;
//     const msLeft = (payload.exp - 30) * 1000 - Date.now();
//     if (msLeft <= 0) return;
//     timerRef.current = setTimeout(() => {
//       logoutInternal("Your session has expired. Please log in again.");
//     }, msLeft);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Core logout (internal — avoids circular dep with the exported one) ────

//   const logoutInternal = useCallback(
//     (message = null) => {
//       clearTimer();
//       setToken(null);
//       setUser(null);
//       setPermissions({});
//       clearSession();
//       navigate("/login", { replace: true, state: { message } });
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [navigate],
//   );

//   // ── Listen for 401 events from apiClient.js ───────────────────────────────

//   useEffect(() => {
//     const handle401 = (e) => logoutInternal(e.detail?.message);
//     window.addEventListener("auth:unauthorized", handle401);
//     return () => window.removeEventListener("auth:unauthorized", handle401);
//   }, [logoutInternal]);

//   // ── Schedule auto-logout on mount if we already have a token ─────────────

//   useEffect(() => {
//     if (token) scheduleAutoLogout(token);
//     return clearTimer;
//   }, []); // intentionally run once on mount only

//   // ── Actions ───────────────────────────────────────────────────────────────

//   const login = useCallback(
//     (response) => {
//       const { token: newToken, user: newUser } = response;
//       if (!newToken || !newUser) {
//         return;
//       }

//       const perms = buildPermissionMap(newUser?.role?.permissions ?? []);

//       setToken(newToken);
//       setUser(newUser);
//       setPermissions(perms);
//       persistSession(newToken, newUser);
//       scheduleAutoLogout(newToken);

//       navigate("/dashboard", { replace: true });
//     },
//     [navigate, scheduleAutoLogout],
//   );

//   const logout = useCallback(
//     (message = null) => logoutInternal(message),
//     [logoutInternal],
//   );

//   /**
//    * Patch the stored user after a profile-update API call.
//    * Only updates the fields you pass — merges with existing user.
//    */
//   const updateUser = useCallback((partial) => {
//     setUser((prev) => {
//       const next = { ...prev, ...partial };
//       sessionStorage.setItem(KEY_USER, JSON.stringify(next));
//       return next;
//     });
//   }, []);

//   /**
//    * can(resource, action) — the recommended way to check permissions.
//    *
//    * @example
//    *   const { can } = useAuth();
//    *   const allowed = can("customers", "delete");
//    */
//   const can = useCallback(
//     (resource, action) => {
//       if (!resource || !action) return false;
//       if (user?.role?.name === "superadmin") return true;
//       return permissions[resource]?.has(action) ?? false;
//     },
//     [permissions, user],
//   );

//   // ── Context value ─────────────────────────────────────────────────────────

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         user,
//         role: user?.role?.name ?? null,
//         permissions,
//         isAuthenticated: Boolean(token && user),
//         login,
//         logout,
//         updateUser,
//         can,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
