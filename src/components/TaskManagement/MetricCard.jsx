import React from "react";

const MetricCard = ({ label, value }) => (
  <div className="bg-gray-200 rounded p-3 text-center">
    <p className="text-2xl font-bold text-accent-dark">{value}</p>
    <p className="text-xs text-gray-600 mt-1">{label}</p>
  </div>
);

export default MetricCard;
