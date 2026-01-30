// import { ArrowUp, ArrowDown } from "lucide-react";

// const StatCard = ({ iconBg, value, total, label, trend, up }) => (
//   <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm px-3 py-2 w-full group">
//     {iconBg && (
//       <div
//         className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300
//         group-hover:scale-110
//         group-hover:rotate-6
//         group-hover:shadow-lg ${iconBg}`}
//       >
//         <span className="text-white font-bold">⏱</span>
//       </div>
//     )}
//     {value && (
//       <h2 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
//         {value}
//         <span className="text-gray-400 dark:text-gray-500 font-medium">
//           {" "}
//           / {total}
//         </span>
//       </h2>
//     )}
//     {label && <p className="text-gray-600 dark:text-gray-400 ">{label}</p>}
//     <hr className="my-1 border-gray-200 dark:border-gray-600" />
//     {trend && (
//       <div
//         className={`flex items-center gap-2 text-sm ${
//           up ? "text-green-600" : "text-red-600"
//         }`}
//       >
//         {up ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
//         {trend}
//       </div>
//     )}
//   </div>
// );

// export default StatCard;

import { ArrowUp, ArrowDown, Clock } from "lucide-react";

const StatCard = ({
  bgColor,
  iconBg,
  icon: Icon = Clock,
  value,
  total,
  label,
  trend,
  up,
}) => (
  <div
    className={`${bgColor}  border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm px-3 py-2 w-full group`}
  >
    {iconBg && (
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300
        group-hover:scale-110
        group-hover:rotate-6
        group-hover:shadow-lg ${iconBg}`}
      >
        {/* Icon render */}
        <Icon className="w-5 h-5 text-white" />
      </div>
    )}

    <h2 className="mt-2 text-lg font-bold text-gray-900 ">
      {value}
      {total && (
        <span className="text-gray-400 dark:text-gray-500 font-medium">
          {" "}
          / {total}
        </span>
      )}
    </h2>

    {label && <p className="text-gray-600 dark:text-gray-400">{label}</p>}
    {trend && <hr className="my-1 border-gray-200 dark:border-gray-600" />}

    {trend && (
      <div
        className={`flex items-center gap-1 text-sm ${
          up ? "text-green-600" : "text-red-600"
        }`}
      >
        {up ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        {trend}
      </div>
    )}
  </div>
);

export default StatCard;
