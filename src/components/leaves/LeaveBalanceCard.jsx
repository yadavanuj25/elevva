import { CalendarCheck, Briefcase, HeartPulse } from "lucide-react";

const iconMap = {
  casual: CalendarCheck,
  sick: HeartPulse,
  earned: Briefcase,
  paid: Briefcase,
};

const colorMap = {
  casual: {
    bar: "bg-amber-500",
    iconBg: "bg-amber-500/20",
    iconText: "text-amber-600",
  },
  sick: {
    bar: "bg-red-500",
    iconBg: "bg-red-500/20",
    iconText: "text-red-600",
  },
  earned: {
    bar: "bg-green-500",
    iconBg: "bg-green-500/20",
    iconText: "text-green-600",
  },
  paid: {
    bar: "bg-green-500",
    iconBg: "bg-green-500/20",
    iconText: "text-green-600",
  },
};

// Safe fallback (prevents crash)
const defaultColors = {
  bar: "bg-gray-400",
  iconBg: "bg-gray-400/20",
  iconText: "text-gray-600",
};

const LeaveBalanceCard = ({ title, total, used, remaining }) => {
  const key = title?.toLowerCase(); // normalize
  const Icon = iconMap[key] || CalendarCheck;
  const colors = colorMap[key] || defaultColors;

  const percentUsed = total > 0 ? Math.min((used / total) * 100, 100) : 0;

  return (
    <div className="leave-card bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-500">{title} Leave</h4>
          <p className="text-2xl font-semibold text-gray-800">
            {remaining}
            <span className="text-sm font-normal text-gray-500"> left</span>
          </p>
        </div>

        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.iconBg}`}
        >
          <Icon size={20} className={colors.iconText} />
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.bar} transition-all duration-500`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>Used: {used}</span>
          <span>Total: {total}</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveBalanceCard;
