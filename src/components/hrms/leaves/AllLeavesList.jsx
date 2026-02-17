import React from "react";

const AllLeavesList = ({ allLeaves, getStatusBadge }) => {
  return (
    <div className="space-y-3">
      {allLeaves.map((leave) => (
        <div
          key={leave._id}
          className="border border-gray-300 dark:border-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <p className="font-semibold">{leave.user?.fullName}</p>-
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {" "}
              {leave.user?.email}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm capitalize">
              {leave.leaveType} - {leave.numberOfDays} days
            </p>
            <p>{getStatusBadge(leave.status)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllLeavesList;
