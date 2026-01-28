import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const isValidDateString = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
};

const generateYears = (start = 1950, end = new Date().getFullYear() + 20) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);
const YEARS = generateYears();

const BasicDatePicker = ({
  name,
  value,
  labelName,
  handleChange,
  errors = {},
  className = "",
}) => {
  const wrapperRef = useRef(null);
  const hasError = errors[name];
  console.log(errors);

  const selectedDate =
    value && isValidDateString(value) ? new Date(value) : null;

  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [inputValue, setInputValue] = useState(value || "");
  const [localError, setLocalError] = useState("");

  /* ---------------- Outside click ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setInputValue(value || "");
    if (isValidDateString(value)) {
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = [];
  for (let i = 0; i < firstDay; i++) dates.push(null);
  for (let d = 1; d <= daysInMonth; d++) dates.push(d);
  const selectDate = (day) => {
    const date = new Date(year, month, day);
    const formatted = formatDate(date);
    handleChange({ target: { name, value: formatted } });
    setInputValue(formatted);
    setLocalError("");
    setOpen(false);
  };
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (!val) {
      setLocalError("");
      handleChange({ target: { name, value: "" } });
      return;
    }
    if (!isValidDateString(val)) {
      setLocalError("Invalid date format (YYYY-MM-DD)");
      return;
    }
    const parsed = new Date(val);
    setCurrentMonth(parsed);
    setLocalError("");
    handleChange({ target: { name, value: val } });
  };
  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Input */}
      <div
        className={`relative w-full ${hasError || localError ? "animate-shake" : ""}`}
      >
        <input
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          // placeholder="YYYY-MM-DD"
          className={`block w-full text-sm bg-transparent rounded-md appearance-none focus:outline-none peer transition border p-[14px]
            ${
              hasError || localError
                ? "border-red-500 text-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-accent-dark dark:focus:border-white"
            }
            dark:text-white`}
        />

        <Calendar
          size={18}
          onClick={() => setOpen(!open)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
        />

        <label
          className={`absolute pointer-events-none text-[15px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 font-[700]
            ${
              hasError || localError
                ? "text-red-500"
                : "peer-focus:text-accent-dark dark:peer-focus:text-white"
            } start-1`}
        >
          {labelName}
        </label>
      </div>

      {/* Calendar */}
      {open && (
        <div className="absolute z-50 mt-2 w-[300px] rounded-xl bg-white dark:bg-[#0f172a] shadow-xl border border-gray-200 dark:border-gray-700 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {/* Month Dropdown */}
              <select
                value={month}
                onChange={(e) =>
                  setCurrentMonth(new Date(year, Number(e.target.value), 1))
                }
                className="text-sm bg-transparent border rounded px-2 py-1"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={year}
                onChange={(e) =>
                  setCurrentMonth(new Date(Number(e.target.value), month, 1))
                }
                className="text-sm bg-transparent border rounded px-2 py-1"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
            ))}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-7 gap-1">
            {dates.map((day, idx) => {
              if (!day) return <div key={idx} />;

              const isSelected =
                selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

              return (
                <button
                  key={idx}
                  onClick={() => selectDate(day)}
                  className={`h-9 w-9 rounded-md text-sm flex items-center justify-center transition
                    ${
                      isSelected
                        ? "bg-accent-dark text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {(hasError || localError) && (
        <p className="text-red-500 text-sm mt-1">{hasError || localError}</p>
      )}
    </div>
  );
};

export default BasicDatePicker;
