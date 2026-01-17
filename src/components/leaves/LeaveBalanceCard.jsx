import { CalendarCheck, Briefcase, HeartPulse } from "lucide-react";

const iconMap = {
  casual: CalendarCheck,
  sick: HeartPulse,
  earned: Briefcase,
  paid: Briefcase,
};

const colorMap = {
  casual: {
    bar: "bg-yellow-500",
    iconBg: "bg-yellow-500/20",
    iconText: "text-yellow-600",
  },
  sick: {
    bar: "bg-red-500",
    iconBg: "bg-red-500/20",
    iconText: "text-red-600",
  },

  paid: {
    bar: "bg-green-500",
    iconBg: "bg-green-500/20",
    iconText: "text-green-600",
  },
  earned: {
    bar: "bg-pink-500",
    iconBg: "bg-pink-500/20",
    iconText: "text-pink-600",
  },
};

const defaultColors = {
  bar: "bg-gray-400",
  iconBg: "bg-gray-400/20",
  iconText: "text-gray-600",
};

const LeaveBalanceCard = ({ title, total, used, remaining }) => {
  const key = title?.toLowerCase();
  const Icon = iconMap[key] || CalendarCheck;
  const colors = colorMap[key] || defaultColors;
  const percentUsed = total > 0 ? Math.min((used / total) * 100, 100) : 0;

  return (
    <div className="leave-card   border border-accent-dark ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4
            className={`text-sm font-medium text-gray-500 ${colors.iconText}`}
          >
            {title} Leave
          </h4>
          <p className="flex items-center gap-2 text-2xl font-semibold text-gray-800 dark:text-white">
            {remaining}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-300">
              {" "}
              left
            </span>
          </p>
        </div>

        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.iconBg}`}
        >
          <Icon size={20} className={colors.iconText} />
        </div>
      </div>

      {/* Progress */}
      <div className="mt-2">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.bar} transition-all duration-500`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>

        <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-300">
          <span>Used: {used}</span>
          <span>Total: {total}</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveBalanceCard;
