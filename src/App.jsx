import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { useLocation } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import ProtectedRoute from "./routers/ProtectedRoute";
import PublicRoute from "./routers/PublicRoute";
import Dashboard from "./pages/Dashboard";
import RoleManagement from "./pages/RoleManagement";
import UserManagement from "./pages/UserManagement";
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
import Attandance from "./pages/HRMS/Attandance";
import Shifts from "./pages/HRMS/Shifts";
import ShiftForm from "./components/hrms/shifts/ShiftForm";
import Holidays from "./pages/HRMS/Holidays";
import Leaves from "./pages/HRMS/Leaves";
import AdminDashboard from "./pages/Dasboards/AdminDashboard";
import EmployeeDashboard from "./pages/Dasboards/EmployeeDashboard";
import DefaultDashboard from "./pages/Dasboards/DefaultDashboard";
import DashboardRouter from "./routers/DashboardRouter";
import DemoDashboard from "./pages/Dasboards/DemoDashboard";

const App = () => {
  const location = useLocation();
  const { user } = useAuth();

  console.log(user);
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
            {/*My Profile */}
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />

            {/* Dashboard */}

            <Route
              path="/demo"
              element={
                <ProtectedRoute>
                  <DemoDashboard />
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
            {/* <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/demo/dashboard"
              element={
                <ProtectedRoute>
                  <DefaultDashboard />
                </ProtectedRoute>
              }
            /> */}

            {/* Settings - Accessible to all */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Users  */}
            <Route
              path="/users"
              element={
                <ProtectedRoute resource="users" action="read">
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/new"
              element={
                <ProtectedRoute resource="users" action="create">
                  <CreateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id/edit"
              element={
                <ProtectedRoute resource="users" action="update">
                  <EditUser />
                </ProtectedRoute>
              }
            />
            {/* Roles */}
            <Route
              path="/roles"
              element={
                <ProtectedRoute resource="users" action="read">
                  <RoleManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles/new"
              element={
                <ProtectedRoute resource="users" action="create">
                  <CreateRole />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles/:id/edit"
              element={
                <ProtectedRoute resource="users" action="update">
                  <EditRole />
                </ProtectedRoute>
              }
            />
            {/* Profiles */}
            <Route
              path="/profiles"
              element={
                <ProtectedRoute resource="profiles" action="read">
                  <Profiles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profiles/:id"
              element={
                <ProtectedRoute resource="profiles" action="read">
                  <ViewProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profiles/new"
              element={
                <ProtectedRoute resource="profiles" action="create">
                  <AddProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profiles/:id/edit"
              element={
                <ProtectedRoute resource="profiles" action="update">
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profiles/stats"
              element={
                <ProtectedRoute resource="profiles" action="read">
                  <ProfileStats />
                </ProtectedRoute>
              }
            />
            {/* Clients  */}
            <Route
              path="/clients"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <ClientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <ViewClient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/stats"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <ClientStats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/new"
              element={
                <ProtectedRoute resource="customers" action="create">
                  <AddClient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id/edit"
              element={
                <ProtectedRoute resource="customers" action="update">
                  <EditClient />
                </ProtectedRoute>
              }
            />

            {/* Clients*/}
            <Route
              path="/clients/requirements"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <ClientsRequirementsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/requirements/stats"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <RequirementStats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/requirements/new"
              element={
                <ProtectedRoute resource="customers" action="create">
                  <ClientRequirement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/requirements/:id/edit"
              element={
                <ProtectedRoute resource="customers" action="update">
                  <EditClientRequirement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/requirements/:id"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <ViewRequirement />
                </ProtectedRoute>
              }
            />

            {/* HRMS */}
            <Route
              path="/hrms/shifts"
              element={
                <ProtectedRoute resource="users" action="read">
                  <Shifts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hrms/shifts/new"
              element={
                <ProtectedRoute resource="users" action="create">
                  {/* <AddShift /> */}
                  <ShiftForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hrms/shifts/:id/edit"
              element={
                <ProtectedRoute resource="users" action="update">
                  {/* <EditShift /> */}
                  <ShiftForm />
                </ProtectedRoute>
              }
            />

            {/* Holidays */}
            <Route
              path="/hrms/holidays"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <Holidays />
                </ProtectedRoute>
              }
            />
            {/* Leaves */}
            <Route
              path="/hrms/leaves"
              element={
                <ProtectedRoute resource="customers" action="read">
                  <Leaves />
                </ProtectedRoute>
              }
            />

            {/* Interview Management Routes */}
            <Route
              path="/interviews"
              element={
                <ProtectedRoute>
                  <InterviewDashboard />
                </ProtectedRoute>
              }
            />
            {/* Task Management */}
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />

            {/* Attendance Management */}
            <Route
              path="/hrms/attendance"
              element={
                <ProtectedRoute>
                  <Attandance />
                </ProtectedRoute>
              }
            />
            {/* 404 Page  Not Found */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </InterviewProvider>
    </div>
  );
};

export default App;
