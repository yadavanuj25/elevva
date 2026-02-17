import React from "react";

const TeamLeavesList = ({ teamLeaves, getStatusBadge, formatDate }) => {
  return (
    <div className="space-y-3">
      {teamLeaves.map((leave) => (
        <div
          key={leave._id}
          className="flex items-center justify-between border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
        >
          <div>
            <p className="font-semibold">{leave.user?.fullName}</p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold capitalize">
                {leave.leaveType}{" "}
              </span>
              - {formatDate(leave.startDate)} to {formatDate(leave.endDate)}
            </p>
          </div>
          <p>{getStatusBadge(leave.status)}</p>
        </div>
      ))}
    </div>
  );
};

export default TeamLeavesList;
