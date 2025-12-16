import React from "react";

const ChartLoader = ({ height = 260 }) => {
  return (
    <div
      className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 relative overflow-hidden"
      style={{ height }}
    >
      {/* Shimmer animation */}
      <div className="absolute top-0 left-0 h-full w-full animate-pulse flex items-center justify-center">
        <p className="text-gray-400 dark:text-gray-300 font-medium text-lg">
          Loading chart...
        </p>
      </div>
    </div>
  );
};

export default ChartLoader;
