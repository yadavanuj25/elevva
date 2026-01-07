import { ArrowUp, ArrowDown } from "lucide-react";

const StatCard = ({ iconBg, value, total, label, trend, up }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-5 w-full">
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}
    >
      <span className="text-white font-bold">⏱</span>
    </div>

    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
      {value}
      <span className="text-gray-400 dark:text-gray-500 font-medium">
        {" "}
        / {total}
      </span>
    </h2>

    <p className="text-gray-600 dark:text-gray-400 mt-1">{label}</p>

    <hr className="my-3 border-gray-200 dark:border-gray-600" />

    <div
      className={`flex items-center gap-2 text-sm ${
        up ? "text-green-600" : "text-red-600"
      }`}
    >
      {up ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
      {trend}
    </div>
  </div>
);

export default StatCard;
