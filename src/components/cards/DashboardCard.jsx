import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const DashboardCard = ({
  title,
  value,
  ratio,
  ratioText,
  img,
  color = "red",
  isPositive = true,
}) => {
  const colorClasses = {
    red: {
      border: "border-red-500",
      bg: "bg-red-50",
      accent: "bg-red-600",
      text: "text-red-600",
    },
    green: {
      border: "border-green-500",
      bg: "bg-[#28a745]",
      accent: "bg-green-600",
      text: "text-green-600",
    },
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-50",
      accent: "bg-blue-600",
      text: "text-blue-600",
    },
    purple: {
      border: "border-purple-500",
      bg: "bg-purple-50",
      accent: "bg-purple-600",
      text: "text-purple-600",
    },
  };

  const c = colorClasses[color] || colorClasses.red;

  return (
    <div className="relative bg-white dark:bg-darkBg font-golos rounded-lg shadow-sm border border-[#E8E8E9] dark:border-gray-600 p-5 flex justify-between items-center transition hover:shadow-md duration-300">
      <div
        className={`absolute top-0 left-0 w-5 h-5 ${c.accent} rounded-br-[12px] rounded-tl-lg`}
      ></div>
      <div className="flex flex-col justify-between h-full">
        <div>
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-500">
            {title}
          </h2>
          <h2 className="text-lg font-extrabold  mt-1 text-black dark:text-white">
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

      {img && (
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full border ${c.border} text-${color}-600`}
        >
          <img src={img} alt="icon" className="w-9 h-9 object-contain" />
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
