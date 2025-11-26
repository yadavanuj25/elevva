import React from "react";

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="p-3">
      <div className="space-y-4 animate-pulse">
        {/* Table Header */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className="h-5 bg-gray-300/80 dark:bg-gray-700 rounded-md"
            ></div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className={`
              grid gap-4 p-3 rounded-lg 
              ${rowIndex % 2 === 0 ? "bg-gray-100/60 dark:bg-gray-800/50" : ""}
            `}
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => {
              // random width variation for more realistic skeleton
              const widthClasses = ["w-3/4", "w-1/2", "w-full", "w-2/3"];
              const randomWidth =
                widthClasses[(rowIndex + colIndex) % widthClasses.length];

              return (
                <div
                  key={colIndex}
                  className={`h-4 ${randomWidth} bg-gray-200 dark:bg-gray-700 rounded-md`}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
