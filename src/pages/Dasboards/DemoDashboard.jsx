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
import DashboardCard from "../../components/cards/DashboardCard";
import { MdAnalytics } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import QuickActions from "../../components/dashboard/QuickActions";
import TopClients from "../../components/dashboard/TopClients";

const recentActivity = [
  {
    id: 1,
    type: "sale",
    user: "John Doe",
    action: "closed a deal worth $25,000",
    time: "5 min ago",
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: 2,
    type: "user",
    user: "Sarah Smith",
    action: "registered as new client",
    time: "12 min ago",
    icon: UserPlus,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 3,
    type: "goal",
    user: "Team Alpha",
    action: "achieved 150% of monthly target",
    time: "1 hour ago",
    icon: Award,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: 4,
    type: "report",
    user: "System",
    action: "generated quarterly report",
    time: "2 hours ago",
    icon: FileText,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    id: 5,
    type: "update",
    user: "Admin",
    action: "updated system configuration",
    time: "3 hours ago",
    icon: Settings,
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
];

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

  getMe: () => api.request("/auth/me"),

  // Dashboard endpoints
  getAdminDashboard: () => api.request("/dashboard/admin"),
  getSalesDashboard: () => api.request("/dashboard/sales"),
  getHRDashboard: () => api.request("/dashboard/hr"),
  getRecruiterDashboard: () => api.request("/dashboard/recruiter"),
  getEmployeeDashboard: () => api.request("/dashboard/employee"),
  getProjectManagerDashboard: () => api.request("/dashboard/project-manager"),
};

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "indigo",
  subtitle,
}) => {
  const colorClasses = {
    indigo: "bg-indigo-500 text-indigo-600 bg-indigo-50",
    green: "bg-green-500 text-green-600 bg-green-50",
    blue: "bg-blue-500 text-blue-600 bg-blue-50",
    purple: "bg-purple-500 text-purple-600 bg-purple-50",
    orange: "bg-orange-500 text-orange-600 bg-orange-50",
    red: "bg-red-500 text-red-600 bg-red-50",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-sm ${trend > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {trend > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 ${colorClasses[color].split(" ")[2]} rounded-lg flex items-center justify-center`}
        >
          <Icon className={colorClasses[color].split(" ")[1]} size={24} />
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Candidates"
          value={data?.overview?.totalCandidates || 0}
          ratio="5.62%"
          ratioText="from last month"
          icon={User}
          color="indigo"
          isPositive={true}
        />
        <DashboardCard
          title="Active Clients"
          value={data?.overview?.activeClients || 0}
          ratio="5.62%"
          ratioText="from last month"
          icon={Building2}
          color="green"
          isPositive={true}
        />
        <DashboardCard
          title="Active Projects"
          value={data?.overview?.activeProjects || 0}
          ratio="5.62%"
          ratioText="from last month"
          icon={Briefcase}
          color="blue"
          isPositive={true}
        />
        <DashboardCard
          title="Active Employees"
          value={data?.overview?.activeEmployees || 0}
          ratio="5.62%"
          ratioText="from last month"
          icon={UserCheck}
          color="red"
          isPositive={true}
        />
        <DashboardCard
          title="Open Deals"
          value={data?.overview?.openDeals || 0}
          ratio="5.62%"
          ratioText="from last month"
          icon={Target}
          color="purple"
          isPositive={true}
        />
        <DashboardCard
          title="Active Placements"
          value={data?.overview?.activePlacements || 0}
          ratio="5.62%"
          ratioText="from last month"
          icon={CheckCircle}
          color="orange"
          isPositive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className=" rounded-xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4">
          <h3 className="text-lg font-bold  mb-4">Revenue Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">
                  ${(data?.revenue?.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="text-green-600" size={32} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-100 rounded-lg">
                <p className="text-sm text-gray-600">Avg Deal Size</p>
                <p className="text-xl font-bold text-gray-800">
                  ${(data?.revenue?.avgDealSize || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-purple-100 rounded-lg">
                <p className="text-sm text-gray-600">Total Deals</p>
                <p className="text-xl font-bold text-gray-800">
                  {data?.revenue?.count || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className=" rounded-xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4">
          <h3 className="text-lg font-bold  mb-4">Department Distribution</h3>
          <div className="space-y-3">
            {data?.departmentDistribution?.map((dept, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {dept._id}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{
                        width: `${(dept.count / data.overview.activeEmployees) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold  w-8 text-right">
                    {dept.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopClients topClients={data?.topClients} />
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-2">
        {/* TOP CLIENTS */}
        <div className=" rounded-xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4">
          <h3 className="font-bold mb-4">Recent Clients</h3>
          {data?.topClients?.map((c) => (
            <div key={c._id} className="py-2 border-b">
              <p className="font-medium">{c.clientName}</p>
              <p className="text-sm text-gray-500">{c.email}</p>
            </div>
          ))}
        </div>

        {/* TOP REQUIREMENTS */}
        <div className=" rounded-xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4">
          <h3 className="font-bold mb-4">Recent Requirements</h3>
          {data?.topRequirements?.map((r) => (
            <div key={r._id} className="py-2 border-b">
              <p className="font-medium">{r.title}</p>
              <p className="text-sm text-gray-500">
                {r.client?.companyName} • {r.experience} yrs
              </p>
            </div>
          ))}
        </div>

        {/* TOP ATTENDANCE */}
        <div className=" rounded-xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4">
          <h3 className="font-bold mb-4">Top Employees by Attendance</h3>
          {data?.topEmployeesByAttendance?.map((e, i) => (
            <div key={i} className="py-2 border-b flex justify-between">
              <span>{e.employee.fullName}</span>
              <span className="font-semibold">{e.presentCount} days</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sales Dashboard
const SalesDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Deals"
          value={data?.metrics?.totalDeals || 0}
          icon={Target}
          color="indigo"
        />
        <StatCard
          title="Pipeline Value"
          value={`$${(data?.metrics?.totalValue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="My Clients"
          value={data?.totalClients || 0}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Win Rate"
          value="65%"
          icon={TrendingUp}
          color="purple"
          trend={12}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Pipeline by Stage
          </h3>
          <div className="space-y-3">
            {data?.pipelineStats?.map((stage, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{stage._id}</span>
                  <span className="text-sm font-bold text-gray-800">
                    {stage.count} deals
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Value: ${stage.totalValue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Deals</h3>
          <div className="space-y-3">
            {data?.myDeals?.slice(0, 5).map((deal) => (
              <div
                key={deal._id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {deal.dealName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {deal.client?.companyName}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      deal.stage === "Closed Won"
                        ? "bg-green-100 text-green-700"
                        : deal.stage === "Closed Lost"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {deal.stage}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    ${deal.value.toLocaleString()}
                  </span>
                  <span className="text-gray-500">
                    {new Date(deal.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// HR Dashboard
const HRDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={data?.totalEmployees || 0}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Pending Leaves"
          value={data?.pendingLeaves?.length || 0}
          icon={Calendar}
          color="orange"
        />
        <StatCard
          title="Present Today"
          value={
            data?.todayAttendance?.find((a) => a._id === "Present")?.count || 0
          }
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Upcoming Joinings"
          value={data?.upcomingJoinings?.length || 0}
          icon={UserCheck}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Employee Status
          </h3>
          <div className="space-y-3">
            {data?.employeeStats?.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-700 capitalize">
                  {stat._id}
                </span>
                <span className="text-lg font-bold text-gray-800">
                  {stat.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Pending Leave Requests
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {data?.pendingLeaves?.map((leave) => (
              <div
                key={leave._id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {leave.employee?.fullName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {leave.employee?.department}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    {leave.days} days
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{leave.leaveType}</span>
                  <span>{new Date(leave.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Recruiter Dashboard
const RecruiterDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Submissions"
          value={data?.metrics?.totalSubmissions || 0}
          icon={FileText}
          color="indigo"
        />
        <StatCard
          title="Total Placements"
          value={data?.metrics?.totalPlacements || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Success Rate"
          value="45%"
          icon={TrendingUp}
          color="purple"
          trend={8}
        />
        <StatCard
          title="Active Candidates"
          value={
            data?.candidateStats?.find((s) => s._id === "Active")?.count || 0
          }
          icon={Users}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Candidate Status
          </h3>
          <div className="space-y-3">
            {data?.candidateStats?.map((stat, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{stat._id}</span>
                  <span className="text-lg font-bold text-gray-800">
                    {stat.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Recent Placements
          </h3>
          <div className="space-y-3">
            {data?.myPlacements?.slice(0, 5).map((placement) => (
              <div
                key={placement._id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {placement.candidate?.fullName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {placement.client?.companyName}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      placement.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : placement.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {placement.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Employee Dashboard
const EmployeeDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Leave Balance"
          value={data?.leaveBalance?.remaining || 0}
          subtitle={`${data?.leaveBalance?.taken || 0} used / ${data?.leaveBalance?.total || 0} total`}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Pending Leaves"
          value={data?.leaveBalance?.pending || 0}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="This Month"
          value={
            data?.attendance?.filter((a) => a.status === "Present").length || 0
          }
          subtitle="Days Present"
          icon={CheckCircle}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Profile Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Employee ID</span>
              <span className="font-semibold">
                {data?.employee?.employeeId}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Department</span>
              <span className="font-semibold capitalize">
                {data?.employee?.department}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Designation</span>
              <span className="font-semibold">
                {data?.employee?.designation}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Reporting To</span>
              <span className="font-semibold">
                {data?.employee?.reportingTo?.fullName || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Recent Leave Requests
          </h3>
          <div className="space-y-3">
            {data?.recentLeaves?.map((leave) => (
              <div
                key={leave._id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">
                    {leave.leaveType}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      leave.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : leave.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{leave.days} days</span>
                  <span>{new Date(leave.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Project Manager Dashboard
const ProjectManagerDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Projects"
          value={data?.metrics?.totalProjects || 0}
          icon={Briefcase}
          color="indigo"
        />
        <StatCard
          title="Active Projects"
          value={data?.metrics?.activeProjects || 0}
          icon={Activity}
          color="green"
        />
        <StatCard
          title="Total Resources"
          value={data?.metrics?.totalResources || 0}
          icon={Users}
          color="blue"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">My Projects</h3>
        <div className="space-y-4">
          {data?.myProjects?.map((project) => (
            <div
              key={project._id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">
                    {project.projectName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {project.client?.companyName}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : project.status === "Completed"
                        ? "bg-blue-100 text-blue-700"
                        : project.status === "On Hold"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Resources: </span>
                  <span className="font-semibold">
                    {project.assignedResources?.length || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Budget: </span>
                  <span className="font-semibold">
                    ${(project.budget || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Duration: </span>
                  <span className="font-semibold">
                    {project.startDate && project.endDate
                      ? `${Math.ceil((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24))} days`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Demo Dashboard
const DemoDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  const checkAuth = async () => {
    const token = api.getToken();
    if (token) {
      try {
        const response = await api.getMe();
        setCurrentUser(response.user);
      } catch (err) {
        api.clearToken();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      let data;
      const role = currentUser.role?.name || currentUser.role;

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
        case "project_manager":
          data = await api.getProjectManagerDashboard();
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
    const role = currentUser?.role?.name || currentUser?.role;

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
      case "project_manager":
        return <ProjectManagerDashboard data={dashboardData} />;
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
        {/* <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentUser.role?.name === "admin"
                    ? "Admin Dashboard"
                    : currentUser.role?.name === "sales_manager"
                      ? "Sales Dashboard"
                      : currentUser.role?.name === "hr_manager"
                        ? "HR Dashboard"
                        : currentUser.role?.name === "recruiter"
                          ? "Recruiter Dashboard"
                          : currentUser.role?.name === "project_manager"
                            ? "Project Manager Dashboard"
                            : "My Dashboard"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <Activity size={18} />
                Refresh
              </button>
            </div>
          </div>
        </header> */}
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
