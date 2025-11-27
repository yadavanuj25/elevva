import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();
const PERMISSION_MAP = {
  "6902f14821ac553ab13fa9a5": "dashboard",
  "6902f14821ac553ab13fa9a6": "users",
  "6902f14821ac553ab13fa9a7": "roles",
  "6902f14821ac553ab13fa9a8": "reports",
  "6902f14821ac553ab13fa9a9": "settings",
  "6902f14821ac553ab13fa9aa": "profile",
  "6902f14821ac553ab13fa9ab": "sales",
  "6902f14821ac553ab13fa9ac": "hr",
  "6902f14821ac553ab13fa9ad": "bde",
  "6902f14821ac553ab13fa9ae": "analytics",
  "6902f14821ac553ab13fa9af": "support",
  "6902f14821ac553ab13fa9b0": "leads",
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggingOut, setLoggingOut] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [modules, setModules] = useState(
    JSON.parse(localStorage.getItem("modules") || "[]")
  );
  useEffect(() => {
    token
      ? localStorage.setItem("token", token)
      : localStorage.removeItem("token");
    user
      ? localStorage.setItem("user", JSON.stringify(user))
      : localStorage.removeItem("user");
    role ? localStorage.setItem("role", role) : localStorage.removeItem("role");
    modules?.length
      ? localStorage.setItem("modules", JSON.stringify(modules))
      : localStorage.removeItem("modules");
  }, [token, user, role, modules]);

  const login = (data) => {
    const { token, user } = data;
    setToken(token);
    setUser(user);
    setRole(user?.role?.name || user?.role || "");
    // Map permission IDs → module names
    if (user?.role?.permissions?.length) {
      const formattedModules = user.role.permissions.map((permId) => {
        const moduleName = PERMISSION_MAP[permId] || permId;
        return { id: permId, name: moduleName };
      });
      setModules(formattedModules);
    } else {
      setModules([]);
    }
  };

  const logout = async () => {
    try {
      setLoggingOut(true);

      const res = await fetch(
        "https://crm-backend-qbz0.onrender.com/api/auth/logout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        console.log(data.message || "Logged out successfully");
      } else {
        console.error("Logout failed:", data.message || "Unknown error");
      }
      setToken(null);
      setUser(null);
      setRole("");
      setModules([]);
      localStorage.removeItem("token");
      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        modules,
        login,
        logout,
        successMsg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
