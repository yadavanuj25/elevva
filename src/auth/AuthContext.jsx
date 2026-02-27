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

const INACTIVITY_LIMIT = 15 * 60 * 1000;

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
      const newToken = res.token || res.data?.token;
      const newUser = res.user || res.data?.user;

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
        const returnUser = response.user || response.data?.user || {};
        const updatedUser = { ...user, ...returnUser, isLocked: true };
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
        const returnUser = response.user || response.data?.user || {};
        const updatedUser = { ...user, ...returnUser, isLocked: false };
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
