import React, { useState, useEffect } from "react";

import DashboardBanner from "../../components/banners/DashboardBanner";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import SalesDashboard from "../../components/dashboard/SalesDashboard";
import HRDashboard from "../../components/dashboard/HRDashboard";
import RecruiterDashboard from "../../components/dashboard/RecruiterDashboard";
import EmployeeDashboard from "../../components/dashboard/EmployeeDashboard";

import { useAuth } from "../../auth/AuthContext";

import {
  getAdminDashboard,
  getSalesDashboard,
  getHRDashboard,
  getRecruiterDashboard,
  getEmployeeDashboard,
} from "../../services/dashboardServices";

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = user?.role?.name || user?.role;

  const dashboardApiMap = {
    admin: getAdminDashboard,
    manager: getAdminDashboard,
    sales: getSalesDashboard,
    "HR-Talent Acquisition": getHRDashboard,
    recruiter: getRecruiterDashboard,
    employee: getEmployeeDashboard,
  };

  const dashboardComponentMap = {
    admin: AdminDashboard,
    manager: AdminDashboard,
    sales: SalesDashboard,
    "HR-Talent Acquisition": HRDashboard,
    recruiter: RecruiterDashboard,
    employee: EmployeeDashboard,
  };

  const DashboardComponent = dashboardComponentMap[role] || EmployeeDashboard;

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const apiCall = dashboardApiMap[role] || getEmployeeDashboard;
      const res = await apiCall();
      setDashboardData(res?.data || res);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
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
            <DashboardComponent data={dashboardData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
