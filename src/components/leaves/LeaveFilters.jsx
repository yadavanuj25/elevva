import React from "react";

const LeaveFilters = () => {
  return (
    <div className="bg-white dark:bg-darkBg p-4 rounded-xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status */}
        <select className="filter-input">
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        {/* Leave Type */}
        <select className="filter-input">
          <option value="">All Leave Types</option>
          <option value="CASUAL">Casual</option>
          <option value="SICK">Sick</option>
          <option value="PAID">Paid</option>
        </select>

        {/* From Date */}
        <input type="date" className="filter-input" />

        {/* To Date */}
        <input type="date" className="filter-input" />
      </div>
    </div>
  );
};

export default LeaveFilters;
