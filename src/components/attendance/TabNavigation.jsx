import React from "react";

const TabNavigation = ({
  activeTab,
  onTabChange,
  tabs = ["stats", "history"],
}) => {
  const tabLabels = {
    stats: "Statistics",
    history: "History",
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === tab
                ? "border-accent-dark text-accent-dark"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
