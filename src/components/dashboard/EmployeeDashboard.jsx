import React from "react";
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

export default EmployeeDashboard;
