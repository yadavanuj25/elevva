import React from "react";

const Card = ({ title, value, icon, subTitle }) => {
  return (
    <div className=" p-3 rounded-lg dark:text-white bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{value}</h3>
          <p>{title}</p>
          {subTitle && <p className="text-xs  ">({subTitle})</p>}
        </div>
        <div className="bg-gray-300 p-2 rounded-full">{icon}</div>
      </div>
    </div>
  );
};

export default Card;
