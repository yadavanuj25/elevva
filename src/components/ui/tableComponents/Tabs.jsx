import React from "react";

const getTabsColor = (s) => {
  switch (s) {
    case "open":
    case "Open":
    case "active":
    case "Active":
      return "text-[#1abe17]";

    case "cancelled":
    case "Cancelled":
    case "terminated":
    case "banned":
    case "Banned":
      return "text-red-800";

    case "in-active":
    case "In-active":
    case "inactive":
    case "dead":
      return "text-red-600";

    case "Prospective":
    case "on hold":
    case "On Hold":
    case "on_hold":
    case "defaulter":
    case "Defaulter":
      return "text-[#f9b801]";

    case "in progress":
    case "In Progress":
    case "in_progress":
      return "text-blue-500";

    case "filled":
    case "Filled":
      return "text-orange-600";

    default:
      return "text-gray-400";
  }
};

const Tabs = ({ statusTabs, handleTabChange, activeTab }) => {
  return (
    <div className="flex gap-4 border-b border-gray-300 dark:border-gray-600 mb-4">
      {statusTabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => handleTabChange(tab.name)}
          className={`relative flex items-center gap-2 px-4 py-2 ${
            activeTab === tab.name
              ? "text-accent-dark border-b-2 border-accent-dark font-semibold"
              : `${getTabsColor(tab.name)}`
          }`}
        >
          {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}

          <span>({tab.count})</span>
        </button>
      ))}
    </div>
  );
};

export default Tabs;
