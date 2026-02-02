// import { createContext, useContext, useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getMe } from "../services/authServices";
// import { getTokenExpiryTime } from "../utils/token";
// import { bindAuthActions } from "../services/bindApi";

// const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// const normalizePermissions = (permissions = []) =>
//   permissions.reduce((acc, { resource, action }) => {
//     acc[resource] ??= [];
//     acc[resource].push(action);
//     return acc;
//   }, {});

// const INACTIVITY_TIMEOUT = 10 * 60 * 1000;
// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
//   // Timers
//   const tokenExpiryTimer = useRef(null);
//   const inactivityTimer = useRef(null);
//   const lastActivityRef = useRef(Date.now());
//   /* STATE */
//   const [token, setToken] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [permissions, setPermissions] = useState({});
//   // Initialize auth on mount
//   useEffect(() => {
//     const bootToken = localStorage.getItem("token");
//     if (!bootToken) {
//       setLoading(false);
//       return;
//     }
//     setToken(bootToken);
//     startTokenExpiryTimer(bootToken);
//     startInactivityTimer();
//     refreshAuth().finally(() => {
//       setLoading(false);
//     });
//   }, []);

//   // Track user activity and reset inactivity timer
//   useEffect(() => {
//     if (!token) return;
//     const activityEvents = [
//       "mousedown",
//       "keydown",
//       "scroll",
//       "touchstart",
//       "click",
//     ];
//     const handleActivity = () => {
//       lastActivityRef.current = Date.now();
//       clearTimeout(inactivityTimer.current);
//       startInactivityTimer();
//     };
//     activityEvents.forEach((event) => {
//       document.addEventListener(event, handleActivity, true);
//     });
//     return () => {
//       activityEvents.forEach((event) => {
//         document.removeEventListener(event, handleActivity, true);
//       });
//     };
//   }, [token]);

//   /* TOKEN EXPIRY TIMER - Logout when JWT expires */
//   const startTokenExpiryTimer = (jwt) => {
//     clearTimeout(tokenExpiryTimer.current);
//     const expiryTime = getTokenExpiryTime(jwt);
//     if (!expiryTime) {
//       return logout();
//     }
//     const timeout = expiryTime - Date.now();
//     if (timeout <= 0) {
//       return logout();
//     }
//     tokenExpiryTimer.current = setTimeout(() => {
//       logout();
//     }, timeout);
//   };
//   /* INACTIVITY TIMER - Logout after 10 minutes of no activity */
//   const startInactivityTimer = () => {
//     clearTimeout(inactivityTimer.current);
//     inactivityTimer.current = setTimeout(() => {
//       logout();
//     }, INACTIVITY_TIMEOUT);
//   };
//   /* REFRESH AUTH - Sync user + permissions from backend */
//   const refreshAuth = async () => {
//     try {
//       const res = await getMe();
//       if (!res.success) {
//         return logout();
//       }
//       const normalized = normalizePermissions(
//         res.user?.role?.permissions || [],
//       );
//       setUser(res.user);
//       setPermissions(normalized);
//     } catch {
//       logout();
//     }
//   };
//   // Bind auth actions for API interceptor to call
//   useEffect(() => {
//     bindAuthActions({
//       refreshAuth,
//       logout,
//     });
//   }, []);

//   const login = ({ token: newToken, user: newUser, rememberMe }) => {
//     const normalized = normalizePermissions(newUser?.role?.permissions || []);

//     setToken(newToken);
//     setUser(newUser);
//     setPermissions(normalized);

//     localStorage.setItem("token", newToken);
//     if (rememberMe) {
//       localStorage.setItem("rememberMe", "true");
//     }

//     lastActivityRef.current = Date.now();
//     startTokenExpiryTimer(newToken);
//     startInactivityTimer();
//   };

//   const logout = () => {
//     clearTimeout(tokenExpiryTimer.current);
//     clearTimeout(inactivityTimer.current);

//     setToken(null);
//     setUser(null);
//     setPermissions({});

//     localStorage.removeItem("token");
//     navigate("/login", { replace: true });
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         user,
//         loading,
//         role: user?.role?.name,
//         permissions,
//         login,
//         logout,
//         refreshAuth,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

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
