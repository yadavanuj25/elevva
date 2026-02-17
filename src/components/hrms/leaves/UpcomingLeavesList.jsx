import React from "react";

const UpcomingLeavesList = ({ upcomingLeaves, formatDate }) => {
  return (
    <div className="space-y-3">
      {upcomingLeaves.map((leave) => (
        <div
          key={leave._id}
          className="border border-green-200 bg-green-100 dark:bg-gray-700 rounded-lg px-4 py-2"
        >
          <p className="font-semibold capitalize">{leave.leaveType} Leave</p>
          <p className="text-xs">
            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default UpcomingLeavesList;
