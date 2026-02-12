import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Search = ({ searchQuery, handleSearchChange, addLink, title }) => {
  return (
    <div className="py-4 border-b border-[#E8E8E9] dark:border-gray-600 flex justify-between items-center">
      <div className="w-1/2">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          className="w-full bg-white dark:bg-darkBg p-2 border border-[#E8E8E9] dark:border-gray-600 rounded-md focus:outline-none focus:border-gray-500 transition"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div>
        <Link
          to={addLink}
          className="px-2 py-1.5 flex gap-1 items-center bg-accent-dark text-white rounded-md"
        >
          <Plus size={18} />
          <span>{title}</span>
        </Link>
      </div>
    </div>
  );
};

export default Search;
