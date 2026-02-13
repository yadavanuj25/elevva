import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const roleDashboardMap = {
  admin: "/admin/dashboard",
  manager: "/admin/dashboard",
  employee: "/employee/dashboard",
  demo: "/demo/dashboard",
};

const DashboardRouter = () => {
  const { user } = useAuth();

  const role = user?.role?.name;
  const redirectPath = roleDashboardMap[role] || "/demo/dashboard";

  return <Navigate to={redirectPath} replace />;
};

export default DashboardRouter;
