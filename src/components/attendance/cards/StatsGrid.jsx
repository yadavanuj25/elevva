import React from "react";
import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import StatCard from "../StatCard";

const StatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      <StatCard
        bgColor="bg-orange-100"
        iconBg="bg-orange-500"
        icon={Calendar}
        value={stats.totalDays}
        label="Total Days"
      />
      <StatCard
        bgColor="bg-green-100"
        iconBg="bg-green-500"
        icon={CheckCircle}
        value={stats.present}
        label="Total Present"
      />
      <StatCard
        bgColor="bg-red-100"
        iconBg="bg-red-500"
        icon={XCircle}
        value={stats.absent}
        label="Total Absent"
      />
      <StatCard
        bgColor="bg-yellow-100"
        iconBg="bg-yellow-500"
        icon={AlertCircle}
        value={stats.halfDay}
        label="Total HalfDay"
      />
      <StatCard
        bgColor="bg-purple-100"
        iconBg="bg-purple-500"
        icon={Briefcase}
        value={stats.totalWorkingHours}
        label="Total Working Hours"
      />
      <StatCard
        bgColor="bg-indigo-100"
        iconBg="bg-indigo-500"
        icon={TrendingUp}
        value={stats.totalOvertimeHours}
        label="Total Overtime Hours"
      />
    </div>
  );
};

export default StatsGrid;
