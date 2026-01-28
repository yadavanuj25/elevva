// import React from "react";

// const UserTabs = ({ activeTab, setActiveTab }) => {
//   const tabs = ["User", "Shift"];
//   return (
//     <div className="border-b border-gray-200 mb-6">
//       <div className="flex gap-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             type="button"
//             onClick={() => setActiveTab(tab)}
//             className={`pb-3 text-sm font-medium transition relative
//               ${
//                 activeTab === tab
//                   ? "text-accent-dark border-b-2 border-accent-dark"
//                   : "text-gray-500 dark:text-gray-300 hover:text-accent-dark "
//               }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UserTabs;

import React from "react";
const UserTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["Basic Information", "Employee & Work details"];
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={` text-medium font-medium transition relative pb-2
              ${
                activeTab === tab
                  ? "text-accent-dark border-b-2 border-accent-dark"
                  : "text-gray-500 dark:text-gray-300 hover:text-accent-dark"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserTabs;
