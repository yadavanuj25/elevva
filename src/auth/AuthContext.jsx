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

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";
import { logoutUser } from "../services/authServices";
import { swalError, swalWarning } from "../utils/swalHelper";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

/* ---------------- PERMISSION NORMALIZER ---------------- */

const normalizePermissions = (permissions = []) => {
  return permissions.reduce((acc, { resource, action }) => {
    if (!acc[resource]) acc[resource] = [];
    acc[resource].push(action);
    return acc;
  }, {});
};

/* ---------------- INACTIVITY EVENTS ---------------- */

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keypress",
  "scroll",
  "touchstart",
];

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [permissions, setPermissions] = useState(
    JSON.parse(localStorage.getItem("permissions") || "{}"),
  );
  const [isLocked, setIsLocked] = useState(
    JSON.parse(localStorage.getItem("isLocked") || "false"),
  );

  const inactivityTimer = useRef(null);
  const tokenExpiryTimer = useRef(null);

  /* ======================================================
     SESSION CLEANUP
  ====================================================== */

  const clearSession = () => {
    setToken(null);
    setUser(null);
    setPermissions({});
    setIsLocked(false);
    localStorage.clear();
  };

  const forceLogout = async (message = "Session expired") => {
    swalWarning(message);
    clearSession();
    navigate("/login", { replace: true });
  };

  /* ======================================================
     TOKEN EXPIRY TIMER
  ====================================================== */

  const startTokenExpiryTimer = (jwtToken) => {
    try {
      const decoded = jwtDecode(jwtToken);
      const expiryTime = decoded.exp * 1000;
      const now = Date.now();
      const timeout = expiryTime - now;

      if (timeout <= 0) {
        forceLogout("Session expired. Please login again.");
        return;
      }

      tokenExpiryTimer.current = setTimeout(() => {
        forceLogout("Session expired. Please login again.");
      }, timeout);
    } catch {
      forceLogout("Invalid session. Please login again.");
    }
  };

  /* ======================================================
     INACTIVITY TIMER
  ====================================================== */

  const resetInactivityTimer = () => {
    if (!token) return;

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    // Example inactivity = 1 minutes
    const INACTIVITY_LIMIT = 1 * 60 * 1000;

    inactivityTimer.current = setTimeout(() => {
      forceLogout("Invalid session. Please login again.");
    }, INACTIVITY_LIMIT);
  };

  const startActivityListeners = () => {
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer),
    );
  };

  const removeActivityListeners = () => {
    ACTIVITY_EVENTS.forEach((event) =>
      window.removeEventListener(event, resetInactivityTimer),
    );
  };

  // Login

  const login = (response) => {
    const { token, user } = response;
    const normalizedPermissions = normalizePermissions(
      user?.role?.permissions || [],
    );
    setToken(token);
    setUser(user);
    setPermissions(normalizedPermissions);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("permissions", JSON.stringify(normalizedPermissions));
    startTokenExpiryTimer(token);
    resetInactivityTimer();
    startActivityListeners();
    navigate("/dashboard");
  };

  /* ======================================================
     LOGOUT
  ====================================================== */

  const logout = async () => {
    try {
      await logoutUser();
    } catch {}

    removeActivityListeners();

    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (tokenExpiryTimer.current) clearTimeout(tokenExpiryTimer.current);

    clearSession();
    navigate("/login", { replace: true });
  };

  //  RESTORE SESSION ON REFRESH

  useEffect(() => {
    if (token) {
      startTokenExpiryTimer(token);
      resetInactivityTimer();
      startActivityListeners();
    }

    return () => {
      removeActivityListeners();
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (tokenExpiryTimer.current) clearTimeout(tokenExpiryTimer.current);
    };
  }, []);

  //  LOCK / UNLOCK (your existing logic)

  const lockScreen = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/lock-screen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setIsLocked(true);
        localStorage.setItem("isLocked", "true");
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (error) {
      swalError(error.message);
    }
  };

  const unlockScreen = async (password) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/unlock-screen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        setIsLocked(false);
        localStorage.setItem("isLocked", "false");
        return { success: true };
      }
      return { success: false };
    } catch {
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
