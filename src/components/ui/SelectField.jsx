import React from "react";
const SelectField = ({
  name,
  label,
  value,
  options = [],
  handleChange,
  loading = false,
  error = "",
}) => {
  return (
    <div className="col-span-2 md:col-span-1">
      <div className="relative w-full">
        <select
          name={name}
          value={value}
          onChange={handleChange}
          className={`block w-full p-[14px] text-sm bg-transparent rounded-md border appearance-none focus:outline-none peer transition
            ${
              error
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-black"
            } dark:text-white`}
        >
          <option value="" disabled hidden>
            --- Select ---
          </option>

          {loading ? (
            <option disabled>Loading...</option>
          ) : (
            <>
              {options.map((opt, i) => (
                <option key={i} value={opt} className="text-darkBg">
                  {opt}
                </option>
              ))}
            </>
          )}
        </select>

        <label
          className={`absolute pointer-events-none font-bold text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
            ${
              error
                ? "peer-focus:text-red-500"
                : "peer-focus:text-darkBg dark:peer-focus:text-white"
            }
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
        >
          {label}
        </label>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default SelectField;

// import React, { useState, useRef, useEffect } from "react";
// import { Search } from "lucide-react";

// const SelectField = ({
//   name,
//   label,
//   value,
//   options = [],
//   handleChange,
//   loading = false,
//   error = "",
// }) => {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const ref = useRef(null);

//   const filteredOptions = options.filter((opt) =>
//     opt.toLowerCase().includes(search.toLowerCase())
//   );

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (ref.current && !ref.current.contains(event.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="col-span-2 md:col-span-1 relative" ref={ref}>
//       <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
//         {label}
//       </label>

//       {/* Selected box */}
//       <div
//         className={`w-full p-3 border rounded-md cursor-pointer bg-white dark:bg-[#273246] text-gray-700 dark:text-white flex justify-between items-center ${
//           error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
//         } `}
//         onClick={() => setOpen(!open)}
//       >
//         <span>{value || "--- Select ---"}</span>
//         <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
//           ▾
//         </span>
//       </div>

//       {/* Dropdown panel */}
//       {open && (
//         <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1e2738] border border-gray-300 dark:border-gray-700 rounded-md  max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
//           {/* Search input */}
//           <div className="flex items-center px-3 py-2 border-b border-gray-200 dark:border-gray-700">
//             <Search
//               size={16}
//               className="text-gray-400 dark:text-gray-400 mr-2"
//             />
//             <input
//               type="text"
//               placeholder="Search..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm"
//             />
//           </div>

//           {/* Options */}
//           {loading ? (
//             <p className="p-3 text-sm text-gray-500">Loading...</p>
//           ) : filteredOptions.length === 0 ? (
//             <p className="p-3 text-sm text-gray-500">No results found</p>
//           ) : (
//             filteredOptions.map((opt, i) => (
//               <div
//                 key={i}
//                 onClick={() => {
//                   handleChange({ target: { name, value: opt } });
//                   setOpen(false);
//                   setSearch("");
//                 }}
//                 className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2d3646] rounded-md text-gray-700 dark:text-gray-100 transition-colors duration-150"
//               >
//                 {opt}
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// };

// export default SelectField;
