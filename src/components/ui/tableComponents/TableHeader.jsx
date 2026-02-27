import React from "react";
import AddButton from "../buttons/AddButton";
import { useAuth } from "../../../auth/AuthContext";
import { hasPermission } from "../../../utils/permissions";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, List } from "lucide-react";

const TableHeader = ({
  searchQuery,
  onSearchChange,
  addLink,
  title,
  viewMode,
  setViewMode,
  resource,
  onAddAction,
}) => {
  const { permissions } = useAuth();
  const navigate = useNavigate();
  const canAdd = hasPermission(permissions, resource, "create");
  const handleAddClick = () => {
    if (!canAdd) {
      navigate("/unauthorized");
      return;
    }
    if (onAddAction) {
      onAddAction();
    } else {
      navigate(addLink);
    }
  };

  return (
    <div className="pb-4 border-b border-[#E8E8E9] dark:border-gray-600 flex justify-between items-center">
      <div className="w-1/2">
        <input
          type="search"
          placeholder="Search by name, email or phone..."
          className="w-full bg-white dark:bg-darkBg p-2 border border-[#E8E8E9] dark:border-gray-600 rounded-md focus:outline-none focus:border-accent-dark dark:focus:border-white transition"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      {/* Add New Button (always visible) */}
      <div className="flex gap-2 items-center">
        <div className="inline-flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 transition-colors ${viewMode === "list"
              ? "bg-accent-dark text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            <List size={20} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 border-l  transition-colors ${viewMode === "grid"
              ? "bg-accent-dark text-white border-accent-dark"
              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            <LayoutGrid size={20} />
          </button>
        </div>
        <AddButton onClick={handleAddClick} title={title} />
      </div>
    </div>
  );
};

export default TableHeader;
