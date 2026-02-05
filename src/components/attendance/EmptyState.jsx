import React from "react";
import { Calendar } from "lucide-react";

const EmptyState = ({
  icon: Icon = Calendar,
  title = "No data available",
  description = "Get started by taking an action",
}) => {
  return (
    <div className="text-center py-8">
      <Icon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <p className="text-gray-500">{title}</p>
      <p className="text-sm text-gray-400 mt-2">{description}</p>
    </div>
  );
};

export default EmptyState;
