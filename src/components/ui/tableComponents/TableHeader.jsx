// import React from "react";
// import AddButton from "../buttons/AddButton";
// import { useAuth } from "../../../auth/AuthContext";
// import { hasPermission } from "../../../utils/permissions";
// import { Search } from "lucide-react";

// const TableHeader = ({
//   searchQuery,
//   onSearchChange,
//   addLink,
//   title,
//   resource,
// }) => {
//   const { permissions } = useAuth();
//   const canAdd = hasPermission(permissions, resource, "create");
//   return (
//     <div className="py-4 border-b border-gray-300 dark:border-gray-600 flex justify-between items-center">
//       <div className="w-1/2">
//         <input
//           type="search"
//           placeholder="Search by name, email or phone..."
//           className="w-full bg-white dark:bg-darkBg p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-accent-dark dark:focus:border-white transition"
//           value={searchQuery}
//           onChange={onSearchChange}
//         />
//       </div>

//       {/* Add New Button */}
//       {/* {addLink && <AddButton addLink={addLink} title={title} />} */}
//       {canAdd && <AddButton addLink={addLink} title={title} />}
//     </div>
//   );
// };

// export default TableHeader;

import React from "react";
import AddButton from "../buttons/AddButton";
import { useAuth } from "../../../auth/AuthContext";
import { hasPermission } from "../../../utils/permissions";
import { useNavigate } from "react-router-dom";

const TableHeader = ({
  searchQuery,
  onSearchChange,
  addLink,
  title,
  resource,
}) => {
  const { permissions } = useAuth();
  const navigate = useNavigate();
  const canAdd = hasPermission(permissions, resource, "create");
  const handleAddClick = () => {
    if (canAdd) {
      navigate(addLink);
    } else {
      navigate("/unauthorized");
    }
  };

  return (
    <div className="py-4 border-b border-gray-300 dark:border-gray-600 flex justify-between items-center">
      <div className="w-1/2">
        <input
          type="search"
          placeholder="Search by name, email or phone..."
          className="w-full bg-white dark:bg-darkBg p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-accent-dark dark:focus:border-white transition"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      {/* Add New Button (always visible) */}
      <AddButton onClick={handleAddClick} title={title} />
    </div>
  );
};

export default TableHeader;
