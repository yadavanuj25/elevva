import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

const SearchableSelect = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Search...",
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </label>

      {/* Input Box */}
      <div
        className="border border-[#E8E8E9] dark:border-gray-600 dark:bg-[#273246] text-gray-800 dark:text-gray-100 rounded-lg px-4 py-3 cursor-pointer flex justify-between items-center shadow-sm hover:shadow-md transition-shadow duration-200"
        onClick={() => setOpen(!open)}
      >
        <span>{options.find((o) => o.value === value)?.label || "Select"}</span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-1 w-full bg-white dark:bg-[#1e2738] border border-[#E8E8E9] dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {/* Search box */}
          <div className="flex items-center bg-gray-200 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <Search
              size={16}
              className="text-gray-400 dark:text-gray-400 mr-2"
            />
            <input
              type="text"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-gray-800 dark:text-gray-100 outline-none placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Options */}
          {filteredOptions.length === 0 ? (
            <p className="p-3 text-gray-500 text-sm">No results found</p>
          ) : (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2d3646] cursor-pointer text-gray-800 dark:text-gray-100 transition-colors duration-150 "
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
