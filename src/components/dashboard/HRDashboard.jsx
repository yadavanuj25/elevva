import React from "react";
import {
  Users,
  UserCheck,
  Calendar,
  CheckCircle,
  X as CloseIcon,
} from "lucide-react";
import StatCard from "../cards/dashboard/StatCard";
import BirthdayCalendar from "./BirthdayCalendar";
import DashboardCard from "../cards/dashboard/DashboardCard";

const HRDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Employees"
          value={data?.totalEmployees || 0}
          icon={Users}
          color="indigo"
          ratio="5.62%"
          ratioText="from last month"
          isPositive={true}
        />
        <DashboardCard
          title="Present Today"
          value={
            data?.todayAttendance?.find((a) => a._id === "Present")?.count || 0
          }
          icon={CheckCircle}
          color="green"
          ratio="5.62%"
          ratioText="from last month"
          isPositive={true}
        />
        <DashboardCard
          title="Present Today"
          value={
            data?.todayAttendance?.find((a) => a._id === "Present")?.count || 0
          }
          icon={CheckCircle}
          color="green"
          ratio="5.62%"
          ratioText="from last month"
          isPositive={true}
        />
        <DashboardCard
          title="Upcoming Joinings"
          value={data?.upcomingJoinings?.length || 0}
          icon={UserCheck}
          color="blue"
          ratio="5.62%"
          ratioText="from last month"
          isPositive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4">
          <h3 className="text-lg font-bold  mb-4">Employee Status</h3>
          <div className="space-y-3">
            {data?.employeeStats?.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {stat._id}
                </span>
                <span className="text-lg font-bold">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4">
          <h3 className="text-lg font-bold mb-4">Pending Leave Requests</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {data?.pendingLeaves?.map((leave) => (
              <div
                key={leave._id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">
                      {leave.employee?.fullName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {leave.employee?.department}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    {leave.days} days
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>{leave.leaveType}</span>
                  <span>{new Date(leave.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BirthdayCalendar />
    </div>
  );
};

export default HRDashboard;
