import React from "react";

const stats = [
  {
    label: "Pending Requests",
    value: 4,
    color: "bg-yellow-100 text-yellow-700",
  },
  { label: "Approved", value: 12, color: "bg-green-100 text-green-700" },
  { label: "Rejected", value: 3, color: "bg-red-100 text-red-700" },
];

const LeaveSummaryCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="p-4 rounded-xl shadow-sm bg-white dark:bg-darkBg"
        >
          <div
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${item.color}`}
          >
            {item.label}
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default LeaveSummaryCards;
