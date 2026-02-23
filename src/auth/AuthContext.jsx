// import { createContext, useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { BASE_URL } from "../config/api";
// import { logoutUser } from "../services/authServices";
// import { swalError } from "../utils/swalHelper";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// const normalizePermissions = (permissions = []) => {
//   return permissions.reduce((acc, { resource, action }) => {
//     if (!acc[resource]) acc[resource] = [];
//     acc[resource].push(action);
//     return acc;
//   }, {});
// };
// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
//   const [isLocked, setIsLocked] = useState(
//     JSON.parse(localStorage.getItem("isLocked") || "false"),
//   );
//   const [permissions, setPermissions] = useState(
//     JSON.parse(localStorage.getItem("permissions") || "{}"),
//   );

//   const login = (response) => {
//     const { token, user } = response;
//     setToken(token);
//     setUser(user);
//     const normalizedPermissions = normalizePermissions(
//       user?.role?.permissions || [],
//     );
//     setPermissions(normalizedPermissions);
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));
//     localStorage.setItem("permissions", JSON.stringify(normalizedPermissions));
//     navigate("/dashboard");
//   };

//   const logout = async () => {
//     try {
//       const response = await logoutUser();
//       if (response?.success) {
//         setToken(null);
//         setUser(null);
//         setPermissions({});
//         setIsLocked(false);
//         localStorage.clear();
//         return true;
//       }
//       return false;
//     } catch (error) {
//       swalError(error.message);
//       return false;
//     }
//   };

//   const lockScreen = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/api/auth/lock-screen`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({}),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setIsLocked(true);
//         localStorage.setItem("isLocked", "true");

//         setUser(data.user);
//         localStorage.setItem("user", JSON.stringify(data.user));
//       }
//     } catch (error) {
//       console.error("Lock failed", error);
//     }
//   };

//   const unlockScreen = async (password) => {
//     try {
//       const response = await fetch(`${BASE_URL}/api/auth/unlock-screen`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ password }),
//       });

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

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         user,
//         role: user?.role?.name,
//         permissions,
//         login,
//         logout,
//         isLocked,
//         lockScreen,
//         unlockScreen,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// import { createContext, useContext, useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import { lock, loginUser, logoutUser, unlock } from "../services/authServices";
// import { swalError } from "../utils/swalHelper";
// import { BASE_URL } from "../config/api";

// const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// /* CONFIG */

// const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 min

// const ACTIVITY_EVENTS = [
//   "mousemove",
//   "mousedown",
//   "keypress",
//   "scroll",
//   "touchstart",
// ];

// /*
//    HELPERS
// */

// const normalizePermissions = (permissions = []) =>
//   permissions.reduce((acc, { resource, action }) => {
//     if (!acc[resource]) acc[resource] = [];
//     acc[resource].push(action);
//     return acc;
//   }, {});

// const isTokenValid = (token) => {
//   try {
//     const decoded = jwtDecode(token);
//     return decoded.exp * 1000 > Date.now();
//   } catch {
//     return false;
//   }
// };

// /* PROVIDER */

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();

//   const [token, setToken] = useState(() => localStorage.getItem("token"));
//   const [user, setUser] = useState(() =>
//     JSON.parse(localStorage.getItem("user")),
//   );
//   const [permissions, setPermissions] = useState(() =>
//     JSON.parse(localStorage.getItem("permissions") || "{}"),
//   );
//   const [isLocked, setIsLocked] = useState(
//     JSON.parse(localStorage.getItem("isLocked") || "false"),
//   );

//   const inactivityTimer = useRef(null);
//   const tokenExpiryTimer = useRef(null);
//   const activityListening = useRef(false);

//   /* SESSION RESTORE */

//   useEffect(() => {
//     if (!token) return;

//     if (!isTokenValid(token)) {
//       clearSession();
//       return;
//     }

//     startTokenExpiryTimer(token);
//     resetInactivityTimer();
//     startActivityListeners();

//     return () => {
//       stopAllTimers();
//       removeActivityListeners();
//     };
//   }, [token]);

//   /* MULTI TAB LOGOUT SYNC */

//   useEffect(() => {
//     const syncLogout = (e) => {
//       if (e.key === "token" && !e.newValue) {
//         logout();
//       }
//     };
//     window.addEventListener("storage", syncLogout);
//     return () => window.removeEventListener("storage", syncLogout);
//   }, []);

//   /* TAB VISIBILITY PAUSE */

//   useEffect(() => {
//     const handleVisibility = () => {
//       if (document.hidden) {
//         stopAllTimers();
//       } else if (token && isTokenValid(token)) {
//         startTokenExpiryTimer(token);
//         resetInactivityTimer();
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibility);
//     return () =>
//       document.removeEventListener("visibilitychange", handleVisibility);
//   }, [token]);

//   /* SESSION CLEANUP */

//   const clearSession = () => {
//     setToken(null);
//     setUser(null);
//     setPermissions({});
//     setIsLocked(false);

//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("permissions");
//     localStorage.removeItem("isLocked");
//   };

//   const stopAllTimers = () => {
//     if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
//     if (tokenExpiryTimer.current) clearTimeout(tokenExpiryTimer.current);
//   };

//   /* TOKEN EXPIRY TIMER */

//   const startTokenExpiryTimer = (jwtToken) => {
//     if (tokenExpiryTimer.current) clearTimeout(tokenExpiryTimer.current);

//     const decoded = jwtDecode(jwtToken);
//     const timeout = decoded.exp * 1000 - Date.now();

//     if (timeout <= 0) {
//       logout("Session expired");
//       return;
//     }

//     tokenExpiryTimer.current = setTimeout(() => {
//       logout("Session expired");
//     }, timeout);
//   };

//   /* INACTIVITY TIMER */

//   const resetInactivityTimer = () => {
//     if (!token) return;

//     if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

//     inactivityTimer.current = setTimeout(() => {
//       logout("Logged out due to inactivity");
//     }, INACTIVITY_LIMIT);
//   };

//   const startActivityListeners = () => {
//     if (activityListening.current) return;

//     ACTIVITY_EVENTS.forEach((event) =>
//       window.addEventListener(event, resetInactivityTimer),
//     );

//     activityListening.current = true;
//   };

//   const removeActivityListeners = () => {
//     ACTIVITY_EVENTS.forEach((event) =>
//       window.removeEventListener(event, resetInactivityTimer),
//     );
//     activityListening.current = false;
//   };

//   /* LOGIN */

//   const login = async (credentials) => {
//     try {
//       stopAllTimers();
//       removeActivityListeners();
//       clearSession();

//       const res = await loginUser(credentials);

//       if (!res.success) {
//         swalError(res.message);
//       }

//       const { token, user } = res;

//       const normalizedPermissions = normalizePermissions(
//         user?.role?.permissions || [],
//       );

//       setToken(token);
//       setUser(user);
//       setPermissions(normalizedPermissions);

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem(
//         "permissions",
//         JSON.stringify(normalizedPermissions),
//       );

//       startTokenExpiryTimer(token);
//       resetInactivityTimer();
//       startActivityListeners();

//       if (user?.isLocked) {
//         navigate("/lock-screen", { replace: true });
//         return { success: true, locked: true };
//       }

//       navigate("/dashboard", { replace: true });
//       return { success: true };
//     } catch (error) {
//       return {
//         success: false,
//         message: error?.message || "Login failed",
//       };
//     }
//   };

//   /* LOGOUT */

//   const logout = async () => {
//     try {
//       await logoutUser();
//     } catch {}

//     stopAllTimers();
//     removeActivityListeners();
//     clearSession();
//     navigate("/login", { replace: true });
//     return;
//   };

//   // Lock screen
//   const lockScreen = async () => {
//     try {
//       const response = await lock();
//       if (response.success) {
//         setIsLocked(true);
//         localStorage.setItem("isLocked", "true");
//         setUser(response.user);
//         localStorage.setItem("user", JSON.stringify(response.user));
//       }
//     } catch (error) {
//       swalError("Lock failed", error);
//     }
//   };

//   // Unlock screen
//   const unlockScreen = async (password) => {
//     try {
//       const response = await unlock(password);
//       if (response.success) {
//         const updatedUser = response.user || { ...user, isLocked: false };
//         setUser(updatedUser);
//         setIsLocked(false);
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         localStorage.setItem("isLocked", "false");
//         return { success: true };
//       }
//       return { success: false };
//     } catch (error) {
//       swalError("Unlock error:", error);
//       return { success: false };
//     }
//   };

//   /* PROVIDER */

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         user,
//         role: user?.role?.name,
//         permissions,
//         isLocked,
//         login,
//         logout,
//         lockScreen,
//         unlockScreen,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { lock, loginUser, logoutUser, unlock } from "../services/authServices";
import { swalError } from "../utils/swalHelper";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 min

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keypress",
  "scroll",
  "touchstart",
];

/* HELPERS */

const normalizePermissions = (permissions = []) =>
  permissions.reduce((acc, { resource, action }) => {
    if (!acc[resource]) acc[resource] = [];
    acc[resource].push(action);
    return acc;
  }, {});

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

/* PROVIDER */

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [permissions, setPermissions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("permissions") || "{}");
    } catch {
      return {};
    }
  });
  const [isLocked, setIsLocked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("isLocked") || "false");
    } catch {
      return false;
    }
  });

  const inactivityTimer = useRef(null);
  const tokenExpiryTimer = useRef(null);
  const activityListening = useRef(false);

  /* SESSION CLEANUP */

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    setPermissions({});
    setIsLocked(false);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    localStorage.removeItem("isLocked");
  }, []);

  const stopAllTimers = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (tokenExpiryTimer.current) clearTimeout(tokenExpiryTimer.current);
  }, []);

  const removeActivityListeners = useCallback(() => {
    ACTIVITY_EVENTS.forEach((event) =>
      window.removeEventListener(event, resetInactivityTimer),
    );
    activityListening.current = false;
  }, []); // eslint-disable-line

  /* INACTIVITY TIMER */

  // FIX: Use useCallback so the same function reference is used for add/remove listeners
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      logout();
    }, INACTIVITY_LIMIT);
  }, []);

  const startActivityListeners = useCallback(() => {
    if (activityListening.current) return;
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer),
    );
    activityListening.current = true;
  }, [resetInactivityTimer]);

  /* LOGOUT */
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // ignore server-side logout errors
    }
    stopAllTimers();
    removeActivityListeners();
    clearSession();
    navigate("/login", { replace: true });
  }, [stopAllTimers, removeActivityListeners, clearSession, navigate]);

  /* TOKEN EXPIRY TIMER */
  const startTokenExpiryTimer = useCallback(
    (jwtToken) => {
      if (tokenExpiryTimer.current) clearTimeout(tokenExpiryTimer.current);
      try {
        const decoded = jwtDecode(jwtToken);
        const timeout = decoded.exp * 1000 - Date.now();
        if (timeout <= 0) {
          logout();
          return;
        }
        tokenExpiryTimer.current = setTimeout(() => {
          logout();
        }, timeout);
      } catch {
        // Invalid token — force logout
        logout();
      }
    },
    [logout],
  );

  /* SESSION RESTORE */
  useEffect(() => {
    if (!token) return;
    if (!isTokenValid(token)) {
      clearSession();
      navigate("/login", { replace: true });
      return;
    }
    startTokenExpiryTimer(token);
    resetInactivityTimer();
    startActivityListeners();
    return () => {
      stopAllTimers();
      removeActivityListeners();
    };
  }, [token]);

  /* MULTI-TAB LOGOUT SYNC */
  useEffect(() => {
    const syncLogout = (e) => {
      // FIX: Check for token removal specifically; avoid triggering on other storage changes
      if (e.key === "token" && !e.newValue) {
        stopAllTimers();
        removeActivityListeners();
        clearSession();
        navigate("/login", { replace: true });
      }
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, [stopAllTimers, removeActivityListeners, clearSession, navigate]);

  /* TAB VISIBILITY PAUSE/RESUME */
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        stopAllTimers();
      } else if (token && isTokenValid(token)) {
        startTokenExpiryTimer(token);
        resetInactivityTimer();
      } else if (token && !isTokenValid(token)) {
        // FIX: Token expired while tab was hidden — log out
        logout();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [
    token,
    stopAllTimers,
    startTokenExpiryTimer,
    resetInactivityTimer,
    logout,
  ]);

  /* LOGIN */
  const login = async (credentials) => {
    try {
      stopAllTimers();
      removeActivityListeners();
      clearSession();
      const res = await loginUser(credentials);
      // FIX: Return early if login failed instead of silently continuing
      if (!res.success) {
        swalError(res.message || "Login failed");
        return { success: false, message: res.message };
      }
      const { token: newToken, user: newUser } = res;

      if (!newToken || !newUser) {
        return { success: false, message: "Invalid server response" };
      }
      const normalizedPermissions = normalizePermissions(
        newUser?.role?.permissions || [],
      );
      setToken(newToken);
      setUser(newUser);
      setPermissions(normalizedPermissions);
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem(
        "permissions",
        JSON.stringify(normalizedPermissions),
      );
      startTokenExpiryTimer(newToken);
      resetInactivityTimer();
      startActivityListeners();
      // FIX: Use newUser.isLocked — not user (stale closure) and check isLocked from response
      const locked = newUser?.isLocked ?? false;
      if (locked) {
        setIsLocked(true);
        localStorage.setItem("isLocked", "true");
        navigate("/lock-screen", { replace: true });
        return { success: true, locked: true };
      }
      navigate("/dashboard", { replace: true });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error?.message || "Login failed",
      };
    }
  };

  /* LOCK SCREEN */

  const lockScreen = async () => {
    try {
      const response = await lock();
      if (response.success) {
        setIsLocked(true);
        localStorage.setItem("isLocked", "true");
        // FIX: Merge updated fields rather than overwriting entire user with partial data
        const updatedUser = { ...user, ...response.user, isLocked: true };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        navigate("/lock-screen", { replace: true });
      }
    } catch (error) {
      swalError("Lock failed", error?.message);
    }
  };

  /* UNLOCK SCREEN */

  const unlockScreen = async (password) => {
    try {
      const response = await unlock(password);
      if (response.success) {
        // FIX: Safely merge user state rather than replacing with potentially partial data
        const updatedUser = { ...user, ...response.user, isLocked: false };
        setUser(updatedUser);
        setIsLocked(false);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("isLocked", "false");
        navigate("/dashboard", { replace: true });
        return { success: true };
      }
      return { success: false, message: response.message || "Unlock failed" };
    } catch (error) {
      return { success: false, message: error?.message };
    }
  };

  /* PROVIDER */

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: user?.role?.name,
        permissions,
        isLocked,
        login,
        logout,
        lockScreen,
        unlockScreen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
