// import React, { useState, useEffect } from "react";

// import DashboardBanner from "../../components/banners/DashboardBanner";
// import AdminDashboard from "../../components/dashboard/AdminDashboard";
// import SalesDashboard from "../../components/dashboard/SalesDashboard";
// import HRDashboard from "../../components/dashboard/HRDashboard";
// import RecruiterDashboard from "../../components/dashboard/RecruiterDashboard";
// import EmployeeDashboard from "../../components/dashboard/EmployeeDashboard";
// import { useAuth } from "../../auth/AuthContext";
// import { BASE_URL } from "../../config/api";

// // API Configuration
// const API_BASE_URL = `${BASE_URL}/api`;

// const api = {
//   setToken: (token) => localStorage.setItem("token", token),
//   getToken: () => localStorage.getItem("token"),
//   clearToken: () => localStorage.removeItem("token"),

//   async request(endpoint, options = {}) {
//     const token = this.getToken();
//     const headers = {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     };

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       ...options,
//       headers,
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message || "Something went wrong");
//     return data;
//   },

//   // Dashboard endpoints
//   getAdminDashboard: () => api.request("/dashboard/admin"),
//   getSalesDashboard: () => api.request("/dashboard/sales"),
//   getHRDashboard: () => api.request("/dashboard/hr"),
//   getRecruiterDashboard: () => api.request("/dashboard/recruiter"),
//   getEmployeeDashboard: () => api.request("/dashboard/employee"),
//   getProjectManagerDashboard: () => api.request("/dashboard/project-manager"),
// };

// // Demo Dashboard
// const DemoDashboard = () => {
//   const { user } = useAuth();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (user) {
//       loadDashboardData();
//     }
//   }, [user]);

//   const loadDashboardData = async () => {
//     setLoading(true);
//     try {
//       let data;
//       const role = user.role?.name || user.role;

//       switch (role) {
//         case "admin":
//           data = await api.getAdminDashboard();
//           break;
//         case "sales_manager":
//         case "sales":
//           data = await api.getSalesDashboard();
//           break;
//         case "hr_manager":
//         case "hr":
//           data = await api.getHRDashboard();
//           break;
//         case "recruiter":
//           data = await api.getRecruiterDashboard();
//           break;

//         case "employee":
//           data = await api.getEmployeeDashboard();
//           break;
//         default:
//           data = await api.getEmployeeDashboard();
//       }
//       setDashboardData(data.data);
//     } catch (err) {
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDashboardComponent = () => {
//     const role = user?.role?.name || user?.role;

//     switch (role) {
//       case "admin":
//         return <AdminDashboard data={dashboardData} />;
//       case "sales_manager":
//       case "sales":
//         return <SalesDashboard data={dashboardData} />;
//       case "hr_manager":
//       case "hr":
//         return <HRDashboard data={dashboardData} />;
//       case "recruiter":
//         return <RecruiterDashboard data={dashboardData} />;
//       case "employee":
//         return <EmployeeDashboard data={dashboardData} />;
//       default:
//         return <EmployeeDashboard data={dashboardData} />;
//     }
//   };

//   return (
//     <div className="min-h-screen  flex">
//       {/* Sidebar */}

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto space-y-4">
//         <DashboardBanner />

//         <div>
//           {loading ? (
//             <div className="flex items-center justify-center h-96">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                 <p className="text-gray-600 mt-4">Loading dashboard...</p>
//               </div>
//             </div>
//           ) : (
//             getDashboardComponent()
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DemoDashboard;

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

const DemoDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = user?.role?.name || user?.role;

  const dashboardApiMap = {
    admin: getAdminDashboard,
    sales_manager: getSalesDashboard,
    sales: getSalesDashboard,
    hr_manager: getHRDashboard,
    hr: getHRDashboard,
    recruiter: getRecruiterDashboard,
    employee: getEmployeeDashboard,
  };

  const dashboardComponentMap = {
    admin: AdminDashboard,
    sales_manager: SalesDashboard,
    sales: SalesDashboard,
    hr_manager: HRDashboard,
    hr: HRDashboard,
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

export default DemoDashboard;
