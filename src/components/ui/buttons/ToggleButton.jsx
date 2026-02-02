import React from "react";
const ToggleButton = ({
  label,
  value,
  onChange,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  activeValue = true,
  inactiveValue = false,
  error,
  className,
  icon1,
  icon2,
}) => {
  return (
    <div className={`flex items-center ${className ? className : "gap-2"}  `}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {className ? "" : ":"}
        </label>
      )}

      <div className="flex justify-start">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full p-0.5">
          <button
            type="button"
            onClick={() => onChange(activeValue)}
            className={`flex gap-1 items-center px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
              value === activeValue
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900"
            }`}
          >
            {icon1 && icon1}
            {activeLabel}
          </button>

          <button
            type="button"
            onClick={() => onChange(inactiveValue)}
            className={`flex gap-1 items-center px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
              value === inactiveValue
                ? "bg-red-600 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900"
            }`}
          >
            {icon2 && icon2}
            {inactiveLabel}
          </button>
        </div>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default ToggleButton;
