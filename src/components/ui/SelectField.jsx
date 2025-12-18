// import React from "react";
// const SelectField = ({
//   name,
//   label,
//   value,
//   options = [],
//   handleChange,
//   loading = false,
//   error = "",
// }) => {
//   return (
//     <div className="col-span-2 md:col-span-1">
//       <div className="relative w-full">
//         <select
//           name={name}
//           value={value}
//           onChange={handleChange}
//           className={`block w-full p-[14px] text-sm bg-transparent rounded-md border appearance-none focus:outline-none peer transition
//             ${
//               error
//                 ? "border-red-500"
//                 : "border-gray-300 dark:border-gray-600 focus:border-black"
//             } dark:text-white`}
//         >
//           <option value="" disabled hidden>
//             --- Select ---
//           </option>

//           {loading ? (
//             <option disabled>Loading...</option>
//           ) : (
//             <>
//               {options.map((opt, i) => (
//                 <option key={i} value={opt} className="text-darkBg">
//                   {opt}
//                 </option>
//               ))}
//             </>
//           )}
//         </select>

//         <label
//           className={`absolute pointer-events-none font-bold text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
//             peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
//             peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
//             ${
//               error
//                 ? "peer-focus:text-red-500"
//                 : "peer-focus:text-darkBg dark:peer-focus:text-white"
//             }
//             rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
//         >
//           {label}
//         </label>

//         {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default SelectField;

// Above is working code -----------------------

// import React, { useState, useRef, useEffect } from "react";
// import { FiSearch } from "react-icons/fi";

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

//   useEffect(() => {
//     const handler = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const filteredOptions = options.filter((opt) =>
//     opt.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="col-span-2 md:col-span-1" ref={ref}>
//       <div className="relative w-full">
//         {/* Trigger */}
//         <div
//           onClick={() => setOpen(!open)}
//           className={`block w-full p-[14px] text-sm bg-transparent rounded-md border cursor-pointer
//             ${
//               error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
//             } dark:text-white`}
//         >
//           {value || "--- Select ---"}
//         </div>

//         {/* Floating label */}
//         <label
//           className={`absolute pointer-events-none font-bold text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
//             peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
//             peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
//             ${
//               error
//                 ? "peer-focus:text-red-500 text-red-500"
//                 : "peer-focus:text-darkBg dark:peer-focus:text-white"
//             }
//             rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
//         >
//           {label}
//         </label>

//         {/* Dropdown */}
//         {open && (
//           <div className="absolute z-50 mt-1 w-full bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600 rounded-md shadow-md">
//             {/* Search */}
//             <div className="flex items-center gap-2 px-3 py-2 border-b dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
//               <FiSearch className="text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full bg-transparent outline-none text-sm dark:text-white"
//               />
//             </div>

//             {/* Options */}
//             <div className="max-h-52 overflow-auto">
//               {loading ? (
//                 <p className="p-3 text-sm text-gray-500">Loading...</p>
//               ) : filteredOptions.length ? (
//                 filteredOptions.map((opt, i) => (
//                   <div
//                     key={i}
//                     onClick={() => {
//                       handleChange({
//                         target: { name, value: opt },
//                       });
//                       setOpen(false);
//                       setSearch("");
//                     }}
//                     className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
//                   >
//                     {opt}
//                   </div>
//                 ))
//               ) : (
//                 <p className="p-3 text-sm text-gray-400">No results</p>
//               )}
//             </div>
//           </div>
//         )}

//         {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default SelectField;

import React, { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

const SelectField = ({
  name,
  label,
  value,
  options = [],
  handleChange,
  loading = false,
  error = "",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ Normalize options (string OR { label, value })
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel =
    normalizedOptions.find((opt) => opt.value === value)?.label || "";

  return (
    <div className="col-span-2 md:col-span-1" ref={ref}>
      <div className="relative w-full">
        {/* Trigger */}
        <div
          onClick={() => setOpen(!open)}
          className={`block w-full p-[14px] text-sm bg-transparent rounded-md border cursor-pointer
            ${
              error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } dark:text-white`}
        >
          {selectedLabel || "-- Select option --"}
        </div>

        {/* Floating label */}
        <label
          className={`absolute pointer-events-none font-bold text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
            ${
              error
                ? "text-red-500"
                : "peer-focus:text-darkBg dark:peer-focus:text-white"
            }
            start-1`}
        >
          {label}
        </label>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600 rounded-md shadow-md">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 border-b dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
              <FiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-sm dark:text-white"
              />
            </div>

            {/* Options */}
            <div className="max-h-52 overflow-auto">
              {loading ? (
                <p className="p-3 text-sm text-gray-500">Loading...</p>
              ) : filteredOptions.length ? (
                filteredOptions.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      handleChange({
                        target: { name, value: opt.value },
                      });
                      setOpen(false);
                      setSearch("");
                    }}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {opt.label}
                  </div>
                ))
              ) : (
                <p className="p-3 text-sm text-gray-400">No results</p>
              )}
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default SelectField;
