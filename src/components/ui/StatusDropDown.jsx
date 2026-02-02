// import React, { useEffect, useRef } from "react";
// import { ChevronUp, ChevronDown } from "lucide-react";
// import StatusLoader from "../loaders/StatusLoader";

// const getStatusColor = (s) => {
//   switch (s) {
//     case "open":
//     case "active":
//     case "Active":
//       return "bg-[#1abe17]";

//     case "cancelled":
//     case "terminated":
//     case "banned":
//     case "Banned":
//       return "bg-red-800";

//     case "in-active":
//     case "inactive":
//     case "dead":
//     case "Dead":
//       return "bg-red-600";

//     case "prospective":
//     case "on hold":
//     case "on_hold":
//     case "defaulter":
//     case "Defaulter":
//       return "bg-[#f9b801]";

//     case "in progress":
//     case "in_progress":
//       return "bg-blue-500";

//     case "filled":
//     case "Filled":
//       return "bg-orange-600";

//     default:
//       return "bg-gray-400";
//   }
// };

// const StatusDropDown = ({
//   rowId,
//   status,
//   openStatusRow,
//   setOpenStatusRow,
//   statusOptions,
//   handleStatusUpdate,
//   statusLoading,
//   position = { left: "-left-4", top: "top-[30px]" },
// }) => {
//   const dropdownRef = useRef(null);
//   const s = status?.toLowerCase() || "";

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpenStatusRow(null);
//       }
//     };

//     if (openStatusRow === rowId) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [openStatusRow, rowId, setOpenStatusRow]);
//   const isLoading = statusLoading === rowId;

//   return (
//     <div className="relative w-max" ref={dropdownRef}>
//       <div
//         onClick={() =>
//           !isLoading && setOpenStatusRow(openStatusRow === rowId ? null : rowId)
//         }
//         className={`min-w-[80px] h-6 cursor-pointer px-1 py-1
//   text-xs font-[500] text-white rounded
//   flex items-center justify-between gap-2 ${getStatusColor(s)}`}
//       >
//         <div className="w-full flex items-center justify-center">
//           {isLoading ? (
//             <StatusLoader color="#ffffff" size={5} />
//           ) : (
//             <span>
//               {status.charAt(0).toUpperCase() + status.slice(1) || "-"}
//             </span>
//           )}
//         </div>
//         {!isLoading && (
//           <>
//             {openStatusRow === rowId ? (
//               <ChevronUp size={16} />
//             ) : (
//               <ChevronDown size={16} />
//             )}
//           </>
//         )}
//       </div>

//       {/* DROPDOWN PANEL */}
//       {openStatusRow === rowId && !isLoading && (
//         <div
//           className={`
//             absolute
//             ${position.left}
//             ${position.top}
//             p-3
//             w-48
//             rounded-xl
//             shadow-[0_4px_20px_rgba(0,0,0,0.15)]
//             bg-white dark:bg-[#283343] dark:text-white
//             border border-gray-200 dark:border-gray-700
//             z-50
//             backdrop-blur-md
//             overflow-hidden
//             animate-fadeIn
//           `}
//         >
//           {statusOptions.map((option) => {
//             const opt = option.toLowerCase();
//             return (
//               <div
//                 key={option}
//                 onClick={() => handleStatusUpdate(rowId, option)}
//                 className="px-2 py-1.5 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
//               >
//                 <span className="font-medium">
//                   {option.charAt(0).toUpperCase() + option.slice(1)}
//                 </span>

//                 <span
//                   className={`w-3 h-3 rounded-full ${getStatusColor(opt)}`}
//                 ></span>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default StatusDropDown;

import React, { useEffect, useRef, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import StatusLoader from "../loaders/StatusLoader";

/* -------------------------------------------
   STATUS → COLOR MAP
-------------------------------------------- */
const getStatusColor = (s) => {
  switch (s) {
    case "open":
    case "active":
      return "bg-[#1abe17]";

    case "cancelled":
    case "terminated":
    case "banned":
      return "bg-red-800";

    case "inactive":
    case "Inactive":
    case "in-active":
    case "dead":
      return "bg-red-600";

    case "prospective":
    case "on hold":
    case "on_hold":
    case "defaulter":
      return "bg-[#f9b801]";

    case "in progress":
    case "in_progress":
      return "bg-blue-500";

    case "filled":
      return "bg-orange-600";

    default:
      return "bg-gray-400";
  }
};

/* -------------------------------------------
   NORMALIZE OPTIONS (string | object)
-------------------------------------------- */
const normalizeStatusOptions = (options = []) =>
  options
    .map((opt) => {
      // STRING OPTIONS → ["active", "inactive"]
      if (typeof opt === "string") {
        return {
          label: opt.charAt(0).toUpperCase() + opt.slice(1),
          value: opt,
          statusKey: opt.toLowerCase(),
        };
      }

      // OBJECT OPTIONS → { label, value }
      if (typeof opt === "object" && opt !== null) {
        return {
          label: opt.label,
          value: opt.value,
          statusKey: opt.label.toLowerCase().replace(/\s+/g, "-"),
        };
      }

      return null;
    })
    .filter(Boolean);

/* -------------------------------------------
   MAIN COMPONENT
-------------------------------------------- */
const StatusDropDown = ({
  rowId,
  status,
  openStatusRow,
  setOpenStatusRow,
  statusOptions = [],
  handleStatusUpdate,
  statusLoading,
  position = { left: "-left-4", top: "top-[30px]" },
}) => {
  const dropdownRef = useRef(null);

  /* ---------- normalize options ---------- */
  const normalizedOptions = useMemo(
    () => normalizeStatusOptions(statusOptions),
    [statusOptions],
  );

  /* ---------- normalize current status ---------- */
  const currentStatusKey =
    typeof status === "boolean"
      ? status
        ? "active"
        : "inactive"
      : status?.toLowerCase() || "";

  /* ---------- click outside ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenStatusRow(null);
      }
    };

    if (openStatusRow === rowId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openStatusRow, rowId, setOpenStatusRow]);

  const isLoading = statusLoading === rowId;

  /* ---------- display label ---------- */
  const displayStatus =
    typeof status === "boolean"
      ? status
        ? "Active"
        : "Inactive"
      : status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : "-";

  return (
    <div className="relative w-max" ref={dropdownRef}>
      {/* ---------------- STATUS BUTTON ---------------- */}
      <div
        onClick={() =>
          !isLoading && setOpenStatusRow(openStatusRow === rowId ? null : rowId)
        }
        className={`min-w-[80px] h-6 cursor-pointer px-1 py-1 
        text-xs font-medium text-white rounded 
        flex items-center justify-between gap-2 
        ${getStatusColor(currentStatusKey)}`}
      >
        <div className="w-full flex items-center justify-center">
          {isLoading ? (
            <StatusLoader color="#ffffff" size={5} />
          ) : (
            <span>{displayStatus}</span>
          )}
        </div>

        {!isLoading &&
          (openStatusRow === rowId ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          ))}
      </div>

      {/* ---------------- DROPDOWN ---------------- */}
      {openStatusRow === rowId && !isLoading && (
        <div
          className={`absolute ${position.left} ${position.top}
            p-3 w-48 rounded-xl z-50
            bg-white dark:bg-[#283343] dark:text-white
            border border-gray-200 dark:border-gray-700
            shadow-[0_4px_20px_rgba(0,0,0,0.15)]
            animate-fadeIn`}
        >
          {normalizedOptions.map((option) => {
            const isActive =
              option.value === status || option.statusKey === currentStatusKey;

            return (
              <div
                key={String(option.value)}
                onClick={() => handleStatusUpdate(rowId, option.value)}
                className={`px-2 py-1.5 text-sm cursor-pointer 
                flex items-center justify-between rounded
                transition-all duration-200
                ${
                  isActive
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="font-medium">{option.label}</span>

                <span
                  className={`w-3 h-3 rounded-full 
                  ${getStatusColor(option.statusKey)}`}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StatusDropDown;
