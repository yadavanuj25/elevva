import React from "react";
import LeaveSummaryCards from "../../../components/leaves/LeaveSummaryCards";
import LeaveFilters from "../../../components/leaves/LeaveFilters";
import TeamLeavesTable from "../../../components/leaves/TeamLeavesTable";

const ManagerLeaveDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Manager Leave Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Review and manage employee leave requests
        </p>
      </div>

      {/* Summary Cards */}
      <LeaveSummaryCards />

      {/* Filters */}
      <LeaveFilters />

      {/* Leave Table */}
      <TeamLeavesTable />
    </div>
  );
};

export default ManagerLeaveDashboard;
