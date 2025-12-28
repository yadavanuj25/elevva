import React from "react";

const Card = ({ title, value, icon, subTitle, color }) => {
  return (
    <div className=" p-3 rounded-lg dark:text-white bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-accent-dark text-lg font-semibold">{value}</h3>
          <p>{title}</p>
          {subTitle && <p className="text-xs">({subTitle})</p>}
        </div>
        <div
          className="text-white p-2 border border-gray-300 dark:border-gray-600 rounded-full"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Card;
