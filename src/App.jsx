import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { useLocation } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import Dashboard from "./pages/Dashboard";
import RoleManagement from "./pages/RoleManagement";
import UserManagement from "./pages/UserManagement";
import SuperDashboard from "./pages/SuperDashboard";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import CreateUser from "./components/userManagement/CreateUser";
import Settings from "./pages/Settings";
import CreateRole from "./components/roleManagement/CreateRole";
import EditRole from "./components/roleManagement/EditRole";
import EditUser from "./components/userManagement/EditUser";
import AddProfile from "./components/profileMnagement/AddProfile";
import EditProfile from "./components/profileMnagement/EditProfile";
import Profiles from "./pages/Profiles";
import ViewProfile from "./components/profileMnagement/ViewProfile";
import AddClient from "./components/clientManagement/AddClient";
import ClientList from "./components/clientManagement/ClientsList";
import EditClient from "./components/clientManagement/EditClient";
import ViewClient from "./components/clientManagement/ViewClient";
import ClientRequirement from "./components/clientManagement/ClientRequirement";
import ClientsRequirementsList from "./components/clientManagement/ClientsRequirementList";
import ViewRequirement from "./components/clientManagement/ViewRequirement";
import EditClientRequirement from "./components/clientManagement/EditClientRequirement";
import ClientStats from "./components/stats/Clients/ClientStats";
import ProfileStats from "./components/stats/Profiles/ProfileStats";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import LockScreen from "./pages/LockScreen";
import Tasks from "./pages/Tasks";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import MyProfile from "./pages/MyProfile";
import RequirementStats from "./components/stats/Requirements/RequirementStats";
import InterviewDashboard from "./pages/InterviewDashboard";
import { InterviewProvider } from "./context/InterViewContext";
import NotFound from "./pages/NotFound";
import Attandance from "./pages/Attendance/Attandance";
import Shifts from "./pages/HRMS/Shifts";
import AddShift from "./components/hrms/AddShift";
import EditShift from "./components/hrms/EditShift";
import DemoHolidays from "./pages/DemoHolidays";
import DemoLeaves from "./pages/DemoLeaves";

const App = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isLocked = user?.isLocked === true;
  const current = location.pathname;
  // Redirect to lock screen if user is locked
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
      <InterviewProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
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

          {/* Private routes with layout */}
          <Route element={<Layout />}>
            {/* Unauthorized Page */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* My Profile - Accessible to all authenticated users */}
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />

            {/* Dashboard Routes */}
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

            {/* Settings - Accessible to all */}
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* HRMS */}
            <Route
              path="/shifts"
              element={
                <ProtectedRoute resource="users" action="read">
                  <Shifts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-shift"
              element={
                <ProtectedRoute resource="users" action="create">
                  <AddShift />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-shift/:id"
              element={
                <ProtectedRoute resource="users" action="update">
                  <EditShift />
                </ProtectedRoute>
              }
            />

            {/* Holidays */}
            <Route
              path="/demo-holidays"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <DemoHolidays />
                </ProtectedRoute>
              }
            />
            {/* Leaves */}
            <Route
              path="/demo-leaves"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <DemoLeaves />
                </ProtectedRoute>
              }
            />

            {/* Profile Management Routes */}
            <Route
              path="/admin/profilemanagement/profiles"
              element={
                <ProtectedRoute resource="profiles" action="read">
                  <Profiles />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/profilemanagement/add-profile"
              element={
                <ProtectedRoute resource="profiles" action="create">
                  <AddProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/profilemanagement/edit-profile/:id"
              element={
                <ProtectedRoute resource="profiles" action="update">
                  <EditProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/profilemanagement/view-profile/:id"
              element={
                <ProtectedRoute resource="profiles" action="read">
                  <ViewProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/profilemanagement/profiles/stats"
              element={
                <ProtectedRoute resource="profiles" action="read">
                  <ProfileStats />
                </ProtectedRoute>
              }
            />

            {/* Role Management Routes */}
            <Route
              path="/admin/rolemanagement/roles"
              element={
                <ProtectedRoute resource="users" action="read">
                  <RoleManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rolemanagement/add-roles"
              element={
                <ProtectedRoute resource="users" action="create">
                  <CreateRole />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rolemanagement/edit-roles/:id"
              element={
                <ProtectedRoute resource="users" action="update">
                  <EditRole />
                </ProtectedRoute>
              }
            />

            {/* User Management Routes */}
            <Route
              path="/admin/usermanagement/users"
              element={
                <ProtectedRoute resource="users" action="read">
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usermanagement/add-user"
              element={
                <ProtectedRoute resource="users" action="create">
                  <CreateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usermanagement/edit-user/:id"
              element={
                <ProtectedRoute resource="users" action="update">
                  <EditUser />
                </ProtectedRoute>
              }
            />

            {/* Client Management Routes */}
            <Route
              path="/admin/clientmanagement/clients"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <ClientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clientmanagement/clients/stats"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <ClientStats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clientmanagement/add-client"
              element={
                <ProtectedRoute resource="customers" action="create">
                  <AddClient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clientmanagement/edit-client/:id"
              element={
                <ProtectedRoute resource="customers" action="update">
                  <EditClient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clientmanagement/view-client/:id"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <ViewClient />
                </ProtectedRoute>
              }
            />

            {/* Client Requirement Routes */}
            <Route
              path="/admin/clientmanagement/clientrequirements"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <ClientsRequirementsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clientmanagement/clientrequirements/stats"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <RequirementStats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clientmanagement/add-clientrequirement"
              element={
                <ProtectedRoute resource="customers" action="create">
                  <ClientRequirement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clientmanagement/edit-requirement/:id"
              element={
                <ProtectedRoute resource="customers" action="update">
                  <EditClientRequirement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clientmanagement/view-requirement/:id"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <ViewRequirement />
                </ProtectedRoute>
              }
            />

            {/* Interview Management Routes */}
            <Route
              path="/admin/interviewmanagement"
              element={
                <ProtectedRoute>
                  <InterviewDashboard />
                </ProtectedRoute>
              }
            />
            {/* Task Management */}
            <Route
              path="/taskboard"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />

            {/* Attendance Management */}
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <Attandance />
                </ProtectedRoute>
              }
            />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </InterviewProvider>
    </div>
  );
};

export default App;
