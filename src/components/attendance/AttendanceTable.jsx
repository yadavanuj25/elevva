import React, { useState, useMemo, useEffect } from "react";
import {
  MdSearch,
  MdEventBusy,
  MdKeyboardArrowDown,
  MdBeachAccess,
  MdCelebration,
} from "react-icons/md";
import { FaCircleHalfStroke } from "react-icons/fa6";

import {
  X,
  Clock,
  MapPin,
  Briefcase,
  Coffee,
  Download,
  Calendar,
  Check,
} from "lucide-react";

const statusConfig = {
  present: {
    icon: <Check size={16} />,
    color: "bg-blue-500",
    borderColor: "border-blue-500",
    label: "Present",
  },
  absent: {
    icon: <X size={16} />,
    color: "bg-red-500",
    borderColor: "border-red-500",
    label: "Absent",
  },
  halfDay: {
    icon: <FaCircleHalfStroke size={16} />,
    color: "bg-gray-400",
    borderColor: "border-gray-400",
    label: "Half Day",
  },
  "on-leave": {
    icon: <MdBeachAccess size={16} />,
    color: "bg-orange-500",
    borderColor: "border-orange-500",
    label: "On-Leave",
  },
  "Week-off": {
    icon: <MdEventBusy size={16} />,
    color: "bg-zinc-500",
    borderColor: "border-zinc-500",
    label: "week-off",
  },
  holiday: {
    icon: <MdCelebration size={16} />,
    color: "bg-indigo-500",
    borderColor: "border-indigo-500",
    label: "Holiday",
  },
};

const months = [
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

// Format time helper
const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Format hours helper
const formatHours = (hours) => {
  if (!hours && hours !== 0) return "0h 0m";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

// Process API data to create attendance calendar
const processAttendanceData = (apiData) => {
  const attendanceMap = new Map();
  apiData.forEach((record) => {
    const date = new Date(record.date);
    const day = date.getDate();
    attendanceMap.set(day, {
      status: record.status,
      punchIn: record.punchIn?.time,
      punchOut: record.punchOut?.time,
      workingHours: record.workingHours,
      overtimeHours: record.overtimeHours,
      isLate: record.isLate,
      lateBy: record.lateBy,
      isEarlyLeave: record.isEarlyLeave,
      earlyLeaveBy: record.earlyLeaveBy,
      breaks: record.breaks || [],
      location: record.punchIn?.location?.address,
      workMode: record.workMode,
      shift: record.shift,
    });
  });

  return attendanceMap;
};

// Attendance Detail Modal Component
const AttendanceDetailModal = ({ dayData, day, employeeName, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  if (!dayData) return null;

  const config = statusConfig[dayData.status] || statusConfig.present;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4
        transition-opacity duration-200
        ${visible ? "opacity-100" : "opacity-0"}
        bg-black/80`}
      onClick={handleClose}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto
          transform transition-all duration-200 shadow-2xl
          ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${config.color} text-white px-6 py-4 rounded-t-lg`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Day {day} - {config.label}
              </h2>
              <p className="text-sm opacity-90 mt-1">{employeeName}</p>
            </div>
            <button
              onClick={handleClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}

        <div className="p-4 space-y-4">
          {/* Time Details */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Clock size={16} />
              Time Details
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Punch In
                </label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatTime(dayData.punchIn)}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Punch Out
                </label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatTime(dayData.punchOut)}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Working Hours
                </label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatHours(dayData.workingHours)}
                </p>
              </div>
              {dayData.overtimeHours > 0 && (
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">
                    Overtime
                  </label>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatHours(dayData.overtimeHours)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Alerts in Grid */}
          <div className="grid grid-cols-3 gap-3">
            {dayData.isLate && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span className="text-xs font-medium text-red-700 dark:text-red-400">
                    Late Arrival
                  </span>
                </div>
                <p className="text-xs text-red-600 dark:text-red-300">
                  Late by {dayData.lateBy} min
                </p>
              </div>
            )}
            {dayData.isEarlyLeave && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span className="text-xs font-medium text-orange-700 dark:text-orange-400">
                    Early Departure
                  </span>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-300">
                  Left early by {dayData.earlyLeaveBy} min
                </p>
              </div>
            )}
            {dayData.shift && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                <h3 className="text-xs font-semibold text-purple-900 dark:text-purple-300 mb-1">
                  Shift
                </h3>
                <p className="text-xs text-purple-700 dark:text-purple-400">
                  {dayData.shift.name}
                </p>
              </div>
            )}
          </div>

          {/* Breaks */}
          {dayData.breaks && dayData.breaks.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Coffee size={16} />
                Breaks
              </h3>
              <div className="space-y-1.5">
                {dayData.breaks.map((br, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-white dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-700"
                  >
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      {br.type}
                    </span>
                    <span className="text-xs text-gray-900 dark:text-white font-semibold">
                      {br.duration} min
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Mode & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dayData.workMode && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <h3 className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                  <Briefcase size={14} />
                  Work Mode
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-400 capitalize font-medium">
                  {dayData.workMode}
                </p>
              </div>
            )}

            {dayData.location && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <h3 className="text-xs font-semibold text-green-900 dark:text-green-300 mb-1 flex items-center gap-1.5">
                  <MapPin size={14} />
                  Location
                </h3>
                <p className="text-xs text-green-700 dark:text-green-400">
                  {dayData.location}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoized Status Circle Component
const StatusCircle = React.memo(
  ({ dayData, day, employeeName, onOpenModal }) => {
    const status = dayData?.status || null;
    if (!status) {
      return (
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#E8E8E9] dark:border-gray-600"></div>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            N/A
          </span>
        </div>
      );
    }

    const config = statusConfig[status] || statusConfig.present;

    const handleClick = () => {
      if (
        dayData.status === "on-leave" ||
        dayData.status === "absent" ||
        dayData.status === "holiday" ||
        dayData.status === "week-off"
      )
        return;
      if (dayData) {
        onOpenModal(dayData, day, employeeName);
      }
    };

    return (
      <div
        className="flex flex-col items-center  gap-1 cursor-pointer w-10"
        onClick={handleClick}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center
      text-white text-xs font-medium
      ${config.color} border-2 ${config.borderColor}`}
        >
          {config.icon}
        </div>

        <div className="h-4  text-[10px] font-medium whitespace-nowrap text-center">
          {dayData?.status === "present" && (
            <span
              className={dayData?.isLate ? "text-orange-500 " : "text-blue-500"}
            >
              {dayData?.isLate ? "Late" : "Present"}
            </span>
          )}

          {dayData?.status === "absent" && (
            <span className="text-red-500">Absent</span>
          )}

          {dayData?.status === "half-day" && (
            <span className="text-gray-500">Half Day</span>
          )}

          {dayData?.status === "on-leave" && (
            <span className="text-orange-500">Leave</span>
          )}

          {dayData?.status === "week-off" && (
            <span className="text-gray-500">Week Off</span>
          )}
        </div>
      </div>
    );
  },
);

StatusCircle.displayName = "StatusCircle";

const AttendanceHistoryTable = ({ history = [], exportAttendance }) => {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("en-US", { month: "long" }),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");

  // Get years from history or default range
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return [
      currentYear.toString(),
      (currentYear - 1).toString(),
      (currentYear - 2).toString(),
    ];
  }, []);

  // Process history data and filter by selected month/year
  const { employee } = useMemo(() => {
    const monthIndex = months.indexOf(selectedMonth);
    const selectedDate = new Date(selectedYear, monthIndex);

    // Filter history for selected month/year
    const filteredHistory = history.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === selectedDate.getMonth() &&
        recordDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    const attendanceMap = processAttendanceData(filteredHistory);
    const firstRecord = filteredHistory[0] || history[0];
    const userName = firstRecord?.user?.name || "Employee";

    const employeeData = {
      id: firstRecord?.user?._id || firstRecord?.user || "1",
      name: userName,
      avatar: userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      attendance: attendanceMap,
    };

    return { attendanceMap, employee: employeeData };
  }, [history, selectedMonth, selectedYear]);

  // Get number of days in selected month
  const daysInMonth = useMemo(() => {
    const monthIndex = months.indexOf(selectedMonth);
    return new Date(selectedYear, monthIndex + 1, 0).getDate();
  }, [selectedMonth, selectedYear]);

  // Calculate days array once
  const daysArray = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth],
  );

  // For now, showing single employee - can be extended for multiple employees
  const employees = useMemo(() => [employee], [employee]);
  // Calculate leave count
  const leaveCount = useMemo(() => {
    return Array.from(employee.attendance.values()).filter(
      (day) => day.status === "on-leave",
    ).length;
  }, [employee.attendance]);

  // Handle opening modal
  const handleOpenModal = (dayData, day, employeeName) => {
    setSelectedDayData(dayData);
    setSelectedDay(day);
    setSelectedEmployeeName(employeeName);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setSelectedDayData(null);
    setSelectedDay(null);
    setSelectedEmployeeName("");
  };

  return (
    <div className="bg-white dark:bg-transparent">
      {/* Header */}
      <div className=" mb-6 bg-white dark:bg-transparent">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="w-full flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative w-1/2">
              <MdSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-10 pr-4 py-2 rounded-lg border border-[#E8E8E9] dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-accent-dark focus:border-transparent "
              />
            </div>

            {/* Year Selector */}
            <div className="relative flex-1">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 pr-10 rounded-lg border border-[#E8E8E9] dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-accent-dark  focus:border-transparent appearance-none cursor-pointer"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <MdKeyboardArrowDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                size={20}
              />
            </div>

            {/* Month Selector */}
            <div className="relative flex-1">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 pr-10 rounded-lg border border-[#E8E8E9] dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-accent-dark focus:border-transparent appearance-none cursor-pointer"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <MdKeyboardArrowDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                size={20}
              />
            </div>

            {/* Download Report */}
            <button
              className="flex-1 bg-accent-dark hover:opacity-90  text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-150"
              onClick={exportAttendance}
            >
              <Download size={16} />
              Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Table */}
      <div className="rounded-lg overflow-hidden border border-[#E8E8E9] dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            {/* Table Header */}
            <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
              <tr>
                <th className="text-left text-gray-700 dark:text-gray-300 font-medium px-6 py-4 min-w-[200px] sticky left-0 bg-gray-50 dark:bg-gray-900 z-20 border-r border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    Employee Name
                    <span className="text-gray-400 dark:text-gray-500">⇅</span>
                  </div>
                </th>
                {daysArray.map((day) => (
                  <th
                    key={day}
                    className="text-center text-gray-700 dark:text-gray-300 font-medium px-2 py-4 min-w-[80px] whitespace-nowrap border-r border-gray-200 dark:border-gray-700"
                  >
                    {day}
                  </th>
                ))}
                <th className="text-center text-gray-700 dark:text-gray-300 font-medium px-6 py-4 min-w-[100px]">
                  Leave
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {employees.map((emp, idx) => (
                <tr
                  key={emp.id}
                  className={`border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    idx % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-800/50"
                  }`}
                >
                  {/* Employee Name Cell */}
                  <td className="px-6 py-4 sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                        {emp.avatar}
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {emp.name}
                      </span>
                    </div>
                  </td>

                  {/* Attendance Status Cells */}
                  {daysArray.map((day) => {
                    const dayData = emp.attendance.get(day);
                    return (
                      <td
                        key={day}
                        className="px-2 py-3 border-r border-gray-200 dark:border-gray-700"
                      >
                        <div
                          className={`flex ${!dayData?.status ? "justify-center" : "justify-center"} `}
                        >
                          <StatusCircle
                            dayData={dayData}
                            day={day}
                            employeeName={emp.name}
                            onOpenModal={handleOpenModal}
                          />
                        </div>
                      </td>
                    );
                  })}

                  {/* Leave Count Cell */}
                  <td className="px-6 py-4 text-center">
                    <span className="text-orange-600 dark:text-orange-500 font-semibold">
                      {leaveCount} Day{leaveCount !== 1 ? "s" : ""}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* No Data State */}
          {employees.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No employees found
            </div>
          )}
        </div>
      </div>

      {/* Legend */}

      <div className="mt-2 bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600 rounded-lg p-4">
        <div className="flex items-center gap-6 flex-wrap">
          <span className="text-gray-900 dark:text-gray-300 font-medium">
            Legend:
          </span>

          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className={`p-0.5 rounded-full border-2 flex items-center justify-center text-white text-xs flex-shrink-0 
            ${config.color} ${config.borderColor}`}
              >
                {config.icon}
              </div>
              <span className="text-gray-700 dark:text-gray-300">
                {config.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Detail Modal */}
      {selectedDayData && (
        <AttendanceDetailModal
          dayData={selectedDayData}
          day={selectedDay}
          employeeName={selectedEmployeeName}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AttendanceHistoryTable;
