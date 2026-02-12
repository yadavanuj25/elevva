import React from "react";

const GroupButton = ({ text, icon, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-1 text-sm  
                  border border-[#E8E8E9] dark:border-gray-600
                 focus:ring-none  focus:outline-none
                 first:rounded-l-md last:rounded-r-md  hover:bg-[#222] hover:text-white hover:dark:text-black hover:dark:bg-white"
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default GroupButton;
