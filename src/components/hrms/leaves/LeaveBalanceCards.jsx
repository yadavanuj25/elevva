import React from "react";

const LeaveBalanceCards = ({ leaveBalance }) => {
  if (!leaveBalance) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
        <p className="text-sm text-gray-600">Casual Leave</p>
        <p className="text-3xl font-bold text-blue-600">
          {leaveBalance.casual?.remaining || 0}
        </p>
        <p className="text-xs text-gray-500">
          of {leaveBalance.casual?.total || 0} days
        </p>
      </div>
      <div className="bg-green-100 rounded-xl p-6 border-l-4 border-green-500">
        <p className="text-sm text-gray-600">Sick Leave</p>
        <p className="text-3xl font-bold text-green-600">
          {leaveBalance.sick?.remaining || 0}
        </p>
        <p className="text-xs text-gray-500">
          of {leaveBalance.sick?.total || 0} days
        </p>
      </div>
      <div className="bg-purple-100 rounded-xl p-6 border-l-4 border-purple-500">
        <p className="text-sm text-gray-600">Earned Leave</p>
        <p className="text-3xl font-bold text-purple-600">
          {leaveBalance.earned?.remaining || 0}
        </p>
        <p className="text-xs text-gray-500">
          of {leaveBalance.earned?.total || 0} days
        </p>
      </div>
      <div className="bg-orange-100 rounded-xl p-6 border-l-4 border-orange-500">
        <p className="text-sm text-gray-600">Unpaid Leave</p>
        <p className="text-3xl font-bold text-orange-600">
          {leaveBalance.unpaid?.used || 0}
        </p>
        <p className="text-xs text-gray-500">days used</p>
      </div>
    </div>
  );
};

export default LeaveBalanceCards;
