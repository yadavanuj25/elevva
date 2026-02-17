import React from "react";

const LeaveTabs = ({
  activeTab,
  setActiveTab,
  isManager,
  isAdmin,
  pendingLeaves,
}) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab("my-leaves")}
          className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
            activeTab === "my-leaves"
              ? "border-purple-500 text-purple-600"
              : "border-transparent text-gray-500"
          }`}
        >
          My Leaves
        </button>
        {isManager && (
          <>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap relative ${
                activeTab === "pending"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              Pending
              {pendingLeaves.length > 0 && (
                <span className="absolute top-2 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingLeaves.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === "team"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              Team
            </button>
          </>
        )}
        {isAdmin && (
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === "all"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500"
            }`}
          >
            All Leaves
          </button>
        )}
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
            activeTab === "upcoming"
              ? "border-purple-500 text-purple-600"
              : "border-transparent text-gray-500"
          }`}
        >
          Upcoming
        </button>
      </nav>
    </div>
  );
};

export default LeaveTabs;
