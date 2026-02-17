import React from "react";

const MyLeavesList = ({ myLeaves, getStatusBadge, formatDate, onCancel }) => {
  return (
    <div className="space-y-4">
      {myLeaves.map((leave) => (
        <div
          key={leave._id}
          className=" text-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold text-sm capitalize">
                {leave.leaveType} Leave
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
              </p>
            </div>
            {getStatusBadge(leave.status)}
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
            <p className="text-sm">
              <strong>Reason:</strong> {leave.reason}
            </p>
          </div>
          {leave.status === "pending" && (
            <button
              onClick={() => onCancel(leave._id)}
              className="mt-2 text-red-600 text-sm hover:underline"
            >
              Cancel Request
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyLeavesList;
