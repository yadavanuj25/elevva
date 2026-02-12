import React from "react";

const StatsCards = ({ statsConfig = [], statsData = {} }) => {
  return (
    <div className="stats-grid">
      {statsConfig.map((card, index) => (
        <div
          key={index}
          className="p-3 rounded-lg dark:text-white bg-white dark:bg-darkBg border border-[#E8E8E9] dark:border-gray-600"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{card.value(statsData)}</h3>
              <p>{card.label}</p>
            </div>
            <div className="bg-gray-300 p-2 rounded-full">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
