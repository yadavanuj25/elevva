import React from "react";

const ReadOnlyInput = ({ value, labelName, className = "", icon = null }) => {
  return (
    <div className={className}>
      <div className="relative w-full">
        <input
          type="text"
          value={value || ""}
          readOnly
          placeholder=" "
          className={`block w-full text-sm  bg-transparent rounded-md appearance-none 
            peer transition border p-[14px] cursor-not-allowed
            ${icon ? "pr-10" : ""}
            border-[#E8E8E9] dark:border-gray-600
            text-gray-800 dark:text-white
             appearance-none focus:outline-none `}
        />

        <label
          className={`absolute pointer-events-none text-[15px] text-gray-500 dark:text-gray-400
    duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]
    bg-white dark:bg-darkBg px-2

    peer-placeholder-shown:scale-100
    peer-placeholder-shown:-translate-y-1/2
    peer-placeholder-shown:top-1/2
    peer-placeholder-shown:font-normal

    peer-focus:top-2
    peer-focus:scale-75
    peer-focus:-translate-y-4
    peer-focus:font-[700]

    peer-[&:not(:placeholder-shown)]:font-[700]  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
        >
          {labelName}
        </label>

        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

export default ReadOnlyInput;
