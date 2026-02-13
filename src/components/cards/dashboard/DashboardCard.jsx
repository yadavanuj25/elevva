import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const DashboardCard = ({
  title,
  value,
  ratio,
  ratioText,
  icon: Icon,
  color = "red",
  isPositive = true,
}) => {
  const colorClasses = {
    indigo: {
      accent: "bg-[#10adc4]",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    green: {
      accent: "bg-[#16a34a]",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    blue: {
      accent: "bg-[#2563eb]",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    purple: {
      accent: "bg-[#9333ea]",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    orange: {
      accent: "bg-[#ea580c]",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    red: {
      accent: "bg-[#f32e2e]",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
  };

  const c = colorClasses[color] || colorClasses.red;

  return (
    <div className="relative bg-white dark:bg-darkBg rounded-lg shadow-md border border-[#E8E8E9] dark:border-gray-600 p-5 flex justify-between items-center transition hover:shadow-lg duration-300">
      {/* top corner accent */}
      <div
        className={`absolute top-0 left-0 w-5 h-5 ${c.accent} rounded-br-[12px] rounded-tl-lg`}
      />

      <div className="flex flex-col justify-between h-full">
        <div>
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </h2>
          <h2 className="text-lg font-extrabold mt-1 text-black dark:text-white">
            {value}
          </h2>
        </div>

        {ratio && (
          <div
            className={`flex items-center gap-1 mt-1 text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
            <span>{ratio}</span>
            {ratioText && (
              <span className="text-gray-700 dark:text-gray-500 font-normal">
                {ratioText}
              </span>
            )}
          </div>
        )}
      </div>

      {/* icon */}
      <div
        className={`w-12 h-12 ${c.iconBg} rounded-lg flex items-center justify-center`}
      >
        <Icon className={c.iconColor} size={24} />
      </div>
    </div>
  );
};

export default DashboardCard;
