import React from "react";
import AddButton from "../buttons/AddButton";
import { Search } from "lucide-react";

const TableHeader = ({ searchQuery, onSearchChange, addLink, title }) => {
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

      {/* Add New Button */}
      {addLink && <AddButton addLink={addLink} title={title} />}
    </div>
  );
};

export default TableHeader;
