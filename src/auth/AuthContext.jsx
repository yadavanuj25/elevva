import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";
import { logoutUser } from "../services/authServices";
import { swalError } from "../utils/swalHelper";

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

  // const logout = () => {
  //   setToken(null);
  //   setUser(null);
  //   setPermissions({});
  //   localStorage.clear();
  //   navigate("/login");
  // };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      swalError(error.message);
    } finally {
      setToken(null);
      setUser(null);
      setPermissions({});
      setIsLocked(false);
      localStorage.clear();
      navigate("/login");
    }
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
