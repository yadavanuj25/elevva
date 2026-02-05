import React from "react";

const BreakTimeDisplay = ({ activeBreak, breakTime }) => {
  return (
    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-yellow-700">Break Time</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
            <span className="text-xs text-yellow-700 capitalize">
              {activeBreak?.type} Break
            </span>
          </div>
        </div>
        <p className="text-medium font-bold text-yellow-600">{breakTime}</p>
      </div>
    </div>
  );
};

export default BreakTimeDisplay;
