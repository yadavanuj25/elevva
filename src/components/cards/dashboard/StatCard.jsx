import React from "react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "indigo",
  subtitle,
}) => {
  const colorClasses = {
    indigo: "bg-indigo-500 text-indigo-600 bg-indigo-50",
    green: "bg-green-500 text-green-600 bg-green-50",
    blue: "bg-blue-500 text-blue-600 bg-blue-50",
    purple: "bg-purple-500 text-purple-600 bg-purple-50",
    orange: "bg-orange-500 text-orange-600 bg-orange-50",
    red: "bg-red-500 text-red-600 bg-red-50",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-sm ${trend > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {trend > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 ${colorClasses[color].split(" ")[2]} rounded-lg flex items-center justify-center`}
        >
          <Icon className={colorClasses[color].split(" ")[1]} size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
