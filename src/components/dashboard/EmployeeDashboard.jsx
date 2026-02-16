import React, { useState } from "react";
import { Calendar, Clock, CheckCircle, X as CloseIcon } from "lucide-react";
import StatCard from "../cards/dashboard/StatCard";
import BirthdayCalendar from "./BirthdayCalendar";
import DashboardCard from "../cards/dashboard/DashboardCard";

const EmployeeDashboard = ({ data }) => {
  const leaveBalances = data?.leaveBalance;
  const attendance = data?.attendance;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Leaves"
          value={leaveBalances?.total || 0}
          icon={Calendar}
          color="red"
          ratio="5.62%"
          ratioText="from last month"
          isPositive={true}
        />
        <DashboardCard
          title="Leave Balance"
          value={leaveBalances?.remaining || 0}
          icon={Calendar}
          color="blue"
          ratio="5.62%"
          ratioText="from last month"
          isPositive={true}
        />

        <DashboardCard
          title="Pending Leaves"
          value={leaveBalances?.pending || 0}
          icon={Clock}
          color="orange"
          ratio="5.62%"
          ratioText="from last month"
          isPositive={true}
        />

        <DashboardCard
          title="Leave Taken"
          value={leaveBalances?.taken || 0}
          icon={CheckCircle}
          color="green"
          ratio="5.62%"
          ratioText="from last month"
          isPositive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4">
          <h3 className="text-lg font-bold  mb-4">Profile Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">
                Employee ID
              </span>
              <span className="font-semibold">
                {data?.employee?.employeeId}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">
                Department
              </span>
              <span className="font-semibold capitalize">
                {data?.employee?.department}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">
                Designation
              </span>
              <span className="font-semibold">
                {data?.employee?.designation}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">
                Reporting To
              </span>
              <span className="font-semibold">
                {data?.employee?.reportingManager?.fullName || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4">
          <h3 className="text-lg font-bold  mb-4">Recent Leave Requests</h3>
          <div className="space-y-3">
            {data?.recentLeaves?.map((leave) => (
              <div
                key={leave._id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
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

      <BirthdayCalendar />
    </div>
  );
};

export default EmployeeDashboard;
