import React from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { CirclePlus, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const TableHeader = ({ searchQuery, onSearchChange, addLink, title }) => {
  return (
    <div className="py-4 border-b border-gray-300 dark:border-gray-600 flex justify-between items-center">
      {/* Search Input */}
      <div className="w-1/2">
        <input
          type="search"
          placeholder="Search by name, email or phone..."
          className="w-full bg-white dark:bg-darkBg p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-gray-500 transition"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      {/* Add New Button */}
      <Link
        to={addLink}
        className="px-2 py-1.5 flex gap-1 items-center bg-dark text-white rounded-md "
      >
        <span>
          <Plus size={15} />
        </span>
        <span>Add New {title}</span>
      </Link>
    </div>
  );
};

export default TableHeader;
