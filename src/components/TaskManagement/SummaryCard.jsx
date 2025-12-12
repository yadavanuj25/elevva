import React from "react";
import {
  Users,
  Briefcase,
  CheckCircle,
  Activity,
  ListTodo,
  UserCheck,
} from "lucide-react";

const SummaryCard = ({ title, count, color, icon }) => {
  const colors = {
    blue: "bg-blue-500/90",
    yellow: "bg-yellow-500/90",
    purple: "bg-purple-500/90",
    green: "bg-green-500/90",
  };
  const Icons = {
    tasks: <UserCheck size={20} />,
    assigned: <ListTodo size={20} />,
    completed: <CheckCircle size={20} />,
    inprogress: <Activity size={20} />,
  };

  return (
    <div
      className={`
        ${colors[color]}
        rounded-lg px-4 py-2 
        text-white shadow-md
        transition-all duration-300
        dark:shadow-black/40
        cursor-pointer
        flex items-center justify-between
        w-full
      `}
    >
      <div className="flex items-center gap-3">
        <div className="bg-white/30 p-1 rounded-lg flex items-center justify-center">
          {Icons[icon]}
        </div>
        <div className="text-sm font-medium opacity-90">{title}</div>
      </div>
      <div className="text-xl font-bold leading-tight">{count || 0}</div>
    </div>
  );
};

export default SummaryCard;
