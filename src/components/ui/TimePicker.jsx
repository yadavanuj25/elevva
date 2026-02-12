import React, { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";

export const TimePicker = ({ label, name, value, handleChange, error }) => {
  const [open, setOpen] = useState(false);
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

  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      times.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }

  const onSelect = (time) => {
    handleChange({
      target: {
        name,
        value: time,
        type: "text", // required for your handleChange
      },
    });
    setOpen(false);
  };

  return (
    <div className="col-span-2 md:col-span-1" ref={ref}>
      <div className="relative w-full">
        {/* Input Display */}
        <div
          tabIndex={0}
          onClick={() => setOpen(!open)}
          className={`block w-full p-[14px] text-sm bg-transparent rounded-md border appearance-none
          focus:outline-none peer cursor-pointer flex items-center justify-between
          ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-[#E8E8E9] dark:border-gray-600 focus:border-accent-dark dark:focus:border-white"
          } dark:text-white`}
        >
          <span className={value ? "" : "text-gray-400"}>
            {value || "Select time"}
          </span>
          <Clock size={16} className="text-gray-400" />
        </div>

        {/* Floating Label */}
        <label
          className={`absolute pointer-events-none font-bold text-sm text-gray-500 dark:text-gray-400
          duration-300 transform scale-75 -translate-y-4 top-2 z-10 origin-[0]
          bg-white dark:bg-darkBg px-2
          ${
            error
              ? "text-red-500"
              : "peer-focus:text-accent-dark dark:peer-focus:text-white"
          }
          start-1`}
        >
          {label}
        </label>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-darkBg border border-[#E8E8E9] dark:border-gray-600 rounded-md shadow-md">
            <div className="max-h-56 overflow-auto">
              {times.map((t) => (
                <div
                  key={t}
                  onClick={() => onSelect(t)}
                  className={`px-4 py-2 text-sm cursor-pointer
                  ${
                    value === t
                      ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};
