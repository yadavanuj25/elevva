import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  BarChart3,
  Briefcase,
  UserCheck,
  TrendingUp,
  Calendar,
  FileText,
  Building2,
  Target,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  LogOut,
  Menu,
  X as CloseIcon,
  Shield,
  Settings,
  User,
  Zap,
  ArrowUpRight,
  MoreVertical,
  DollarSign,
  Award,
} from "lucide-react";
import DashboardBanner from "../../components/banners/DashboardBanner";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import SalesDashboard from "../../components/dashboard/SalesDashboard";
import HRDashboard from "../../components/dashboard/HRDashboard";
import RecruiterDashboard from "../../components/dashboard/RecruiterDashboard";
import EmployeeDashboard from "../../components/dashboard/EmployeeDashboard";
import { useAuth } from "../../auth/AuthContext";

// API Configuration
const API_BASE_URL = "http://localhost:5000/api";

const api = {
  setToken: (token) => localStorage.setItem("token", token),
  getToken: () => localStorage.getItem("token"),
  clearToken: () => localStorage.removeItem("token"),

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Something went wrong");
    return data;
  },

  // getMe: () => api.request("/auth/me"),

  // Dashboard endpoints
  getAdminDashboard: () => api.request("/dashboard/admin"),
  getSalesDashboard: () => api.request("/dashboard/sales"),
  getHRDashboard: () => api.request("/dashboard/hr"),
  getRecruiterDashboard: () => api.request("/dashboard/recruiter"),
  getEmployeeDashboard: () => api.request("/dashboard/employee"),
  getProjectManagerDashboard: () => api.request("/dashboard/project-manager"),
};

// Demo Dashboard
const DemoDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      let data;
      const role = user.role?.name || user.role;

      switch (role) {
        case "admin":
          data = await api.getAdminDashboard();
          break;
        case "sales_manager":
        case "sales":
          data = await api.getSalesDashboard();
          break;
        case "hr_manager":
        case "hr":
          data = await api.getHRDashboard();
          break;
        case "recruiter":
          data = await api.getRecruiterDashboard();
          break;

        case "employee":
          data = await api.getEmployeeDashboard();
          break;
        default:
          data = await api.getEmployeeDashboard();
      }
      setDashboardData(data.data);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDashboardComponent = () => {
    const role = user?.role?.name || user?.role;

    switch (role) {
      case "admin":
        return <AdminDashboard data={dashboardData} />;
      case "sales_manager":
      case "sales":
        return <SalesDashboard data={dashboardData} />;
      case "hr_manager":
      case "hr":
        return <HRDashboard data={dashboardData} />;
      case "recruiter":
        return <RecruiterDashboard data={dashboardData} />;
      case "employee":
        return <EmployeeDashboard data={dashboardData} />;
      default:
        return <EmployeeDashboard data={dashboardData} />;
    }
  };

  return (
    <div className="min-h-screen  flex">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 overflow-auto space-y-4">
        <DashboardBanner />

        <div>
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            getDashboardComponent()
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoDashboard;
