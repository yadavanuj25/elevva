import React, { useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const getStatusColor = (s) => {
  switch (s) {
    case "open":
    case "active":
    case "Active":
      return "bg-[#1abe17]";

    case "cancelled":
    case "terminated":
    case "banned":
    case "Banned":
      return "bg-red-800";

    case "in-active":
    case "inactive":
      return "bg-red-600";

    case "on hold":
    case "on_hold":
    case "defaulter":
    case "Defaulter":
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

const StatusDropDown = ({
  rowId,
  status,
  openStatusRow,
  setOpenStatusRow,
  statusOptions,
  handleStatusUpdate,
  position = { left: "-left-4", top: "top-[50px]" },
}) => {
  const dropdownRef = useRef(null);
  const s = status?.toLowerCase() || "";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  return (
    <div className="relative w-max" ref={dropdownRef}>
      {/* STATUS BADGE */}
      <div
        onClick={() => setOpenStatusRow(openStatusRow === rowId ? null : rowId)}
        className={`w-max cursor-pointer px-2 py-1 text-xs text-center font-[500] text-white rounded-md flex items-center justify-between gap-2 ${getStatusColor(
          s
        )}`}
      >
        <span>{status.charAt(0).toUpperCase() + status.slice(1) || "-"}</span>

        {openStatusRow === rowId ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )}
      </div>

      {/* DROPDOWN PANEL */}
      {openStatusRow === rowId && (
        <div
          className={`
            absolute
            ${position.left}
            ${position.top}
            p-3
            w-48
            rounded-xl
            shadow-[0_4px_20px_rgba(0,0,0,0.15)]
            bg-white dark:bg-[#283343] dark:text-white
            border border-gray-200 dark:border-gray-700
            z-50
            backdrop-blur-md
            overflow-hidden
            animate-fadeIn
          `}
        >
          {statusOptions.map((option) => {
            const opt = option.toLowerCase();
            return (
              <div
                key={option}
                onClick={() => handleStatusUpdate(rowId, option)}
                className="px-4 py-3 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <span className="font-medium">
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </span>

                <span
                  className={`w-3 h-3 rounded-full ${getStatusColor(opt)}`}
                ></span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StatusDropDown;
