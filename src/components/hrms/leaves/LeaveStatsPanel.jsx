import React from "react";
import { BarChart3 } from "lucide-react";

const LeaveStatsPanel = ({ leaveStats }) => {
  if (!leaveStats) return null;

  return (
    <div className="rounded-2xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5 text-purple-600" />
        <span>Your Leave Statistics</span>
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        <div className="text-center p-3 bg-gray-100  rounded-lg">
          <h2 className="dark:text-gray-700">{leaveStats.total}</h2>
          <h2 className="text-xs text-gray-600 ">Total</h2>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <h2 className=" text-yellow-600">{leaveStats.pending}</h2>
          <p className="text-xs text-gray-600">Pending</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <h2 className=" text-green-600">{leaveStats.approved}</h2>
          <p className="text-xs text-gray-600">Approved</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <h2 className=" text-red-600">{leaveStats.rejected}</h2>
          <p className="text-xs text-gray-600">Rejected</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <h2 className=" text-blue-600">{leaveStats.totalDaysUsed}</h2>
          <p className="text-xs text-gray-600">Days Used</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <h2 className=" text-purple-600">
            {Object.values(leaveStats.byType || {}).reduce((a, b) => a + b, 0)}
          </h2>
          <p className="text-xs text-gray-600">This Year</p>
        </div>
      </div>
    </div>
  );
};

export default LeaveStatsPanel;
