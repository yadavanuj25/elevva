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
