import React from "react";
const SummaryCard = ({ title, count, color }) => {
  const colors = {
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
  };

  return (
    <div className={`${colors[color]} rounded-lg p-6 text-white shadow-lg`}>
      <div className="text-sm font-medium opacity-90">{title}</div>
      <div className="text-4xl font-bold mt-2">{count || 0}</div>
    </div>
  );
};

export default SummaryCard;
