import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const PendingLeavesList = ({
  pendingLeaves,
  formatDate,
  onApprove,
  onReject,
}) => {
  return (
    <div className="space-y-4">
      {pendingLeaves.map((leave) => (
        <div
          key={leave._id}
          className="text-gray-700  border border-yellow-200 rounded-lg px-4 py-2 bg-yellow-100"
        >
          <h3 className="font-semibold">{leave.user?.fullName}</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm capitalize">
              {leave.leaveType} - {leave.numberOfDays} days
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
            </p>
          </div>
          <div className="bg-white rounded p-3 mt-2">
            <p className="text-sm">
              <strong>Reason:</strong> {leave.reason}
            </p>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={() => {
                onApprove(leave._id);
              }}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => onReject(leave._id)}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingLeavesList;
