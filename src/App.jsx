import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import Dashboard from "./pages/Dashboard";
import RoleManagement from "./pages/RoleManagement";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import SuperDashboard from "./pages/SuperDashboard";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import CreateUser from "./components/userManagement/CreateUser";
import Settings from "./pages/Settings";
import CreateRole from "./components/roleManagement/CreateRole";
import EditRole from "./components/roleManagement/EditRole";
import EditUser from "./components/userManagement/EditUser";
import ProfileSubmission from "./components/profileMnagement/ProfileSubmission";
import EditProfile from "./components/profileMnagement/EditProfile";
import Profiles from "./pages/Profiles";
import ViewProfile from "./components/profileMnagement/ViewProfile";
import AddClient from "./components/clientManagement/AddClient";
import ClientList from "./components/clientManagement/ClientsList";
import EditClient from "./components/clientManagement/EditClient";
import ViewClient from "./components/clientManagement/ViewClient";
import ClientRequirement from "./components/clientManagement/ClientRequirement";
import ClientsRequirementsList from "./components/clientManagement/ClientsRequirementList";
// import ClientsRequirementsList from "./components/clientManagement/ClientRequirementListDemo";
import ViewRequirement from "./components/clientManagement/ViewRequirement";
import EditClientRequirement from "./components/clientManagement/EditClientRequirement";
import ClientStats from "./components/stats/Clients/ClientStats";
import ProfileStats from "./components/stats/Profiles/ProfileStats";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import LockScreen from "./pages/LockScreen";
import Tasks from "./pages/Tasks";
import UnauthorizedPage from "./pages/UnauthorizedPage";

const App = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isLocked = user?.isLocked === true;
  const current = location.pathname;

  if (isLocked && current !== "/lock-screen") {
    return <Navigate to="/lock-screen" replace />;
  }
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/lock-screen" element={<LockScreen />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/lock-screen"
          element={
            <PublicRoute>
              <LockScreen />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}

        {/* Private routes with layout */}
        <Route element={<AdminLayout />}>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/admin/super-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <SuperDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Reports */}
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedModules={["reports"]}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/hr"
            element={
              <ProtectedRoute
                allowedModules={["reports"]}
                allowedSubmodules={["HR"]}
              >
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/bde"
            element={
              <ProtectedRoute
                allowedModules={["reports"]}
                allowedSubmodules={["BDE"]}
              >
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/sales"
            element={
              <ProtectedRoute
                allowedModules={["reports"]}
                allowedSubmodules={["Sales"]}
              >
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Settings */}
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Profiles */}
          <Route
            path="/admin/profilemanagement/profiles"
            element={
              <ProtectedRoute allowedModules={["profile"]}>
                <Profiles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profilemanagement/add-profile"
            element={
              <ProtectedRoute allowedModules={["profile"]}>
                <ProfileSubmission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profilemanagement/edit-profile/:id"
            element={
              <ProtectedRoute allowedModules={["profile"]}>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profilemanagement/view-profile/:id"
            element={
              <ProtectedRoute allowedModules={["profile"]}>
                <ViewProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profilemanagement/profiles/stats"
            element={
              <ProtectedRoute allowedModules={["profile"]}>
                <ProfileStats />
              </ProtectedRoute>
            }
          />
          {/* Roles */}
          <Route
            path="/admin/rolemanagement/roles"
            element={
              <ProtectedRoute allowedModules={["users", "roles"]}>
                {/* allowedModules={["roles"]} */}
                <RoleManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rolemanagement/add-roles"
            element={
              <ProtectedRoute allowedModules={["users", "roles"]}>
                <CreateRole />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rolemanagement/edit-roles/:id"
            element={
              <ProtectedRoute allowedModules={["users", "roles"]}>
                <EditRole />
              </ProtectedRoute>
            }
          />
          {/* Users */}
          <Route
            path="/admin/usermanagement/users"
            element={
              <ProtectedRoute allowedModules={["users"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usermanagement/add-user"
            element={
              <ProtectedRoute allowedModules={["users"]}>
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usermanagement/edit-user/:id"
            element={
              <ProtectedRoute allowedModules={["users"]}>
                <EditUser />
              </ProtectedRoute>
            }
          />
          {/* Clients */}
          <Route
            path="/admin/clientmanagement/clients"
            element={
              <ProtectedRoute allowedModules={["users"]}>
                <ClientList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clientmanagement/clients/stats"
            element={
              <ProtectedRoute allowedModules={["users"]}>
                <ClientStats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clientmanagement/add-client"
            element={
              <ProtectedRoute allowedModules={["users"]}>
                <AddClient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clientmanagement/edit-client/:id"
            element={
              <ProtectedRoute allowedModules={["users"]}>
                <EditClient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clientmanagement/view-client/:id"
            element={
              <ProtectedRoute allowedModules={["users"]}>
                <ViewClient />
              </ProtectedRoute>
            }
          />
          {/* Client requirement */}
          <Route
            path="/admin/clientmanagement/clientrequirements"
            element={
              <ProtectedRoute allowedModules={["users"]}>
                {/* <ClientsRequirementsList /> */}
                <ClientsRequirementsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clientmanagement/add-clientrequirement"
            element={
              <ProtectedRoute allowedModules={["users"]}>
                <ClientRequirement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clientmanagement/edit-requirement/:id"
            element={
              <ProtectedRoute allowedModules={["users"]}>
                <EditClientRequirement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clientmanagement/view-requirement/:id"
            element={
              <ProtectedRoute allowedModules={["users"]}>
                <ViewRequirement />
              </ProtectedRoute>
            }
          />

          {/* Task management */}

          <Route
            path="/taskboard"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
