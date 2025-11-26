import React from "react";

const FormSkeleton = ({ rows = 5 }) => {
  return (
    <div className=" bg-white dark:bg-gray-800 p-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        ))}
      </div>
      <div className="mt-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default FormSkeleton;
