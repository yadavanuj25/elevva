import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TableSortLabel,
} from "@mui/material";
import NoData from "../ui/NoData";
import { MdLocationOff } from "react-icons/md";

const checkboxSx = {
  color: "#6b7280",
  "&.Mui-checked": {
    color: "#2563eb",
  },
  ".dark &": {
    color: "#d1d5db",
    "&.Mui-checked": {
      color: "#60a5fa",
    },
  },
};

const formatTime = (date) => {
  if (!date) return "--";
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (date) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// total break minutes
const calculateTotalBreakMinutes = (breaks = []) => {
  return breaks.reduce((total, br) => {
    if (br.duration) return total + br.duration;
    if (br.breakStart && br.breakEnd) {
      const start = new Date(br.breakStart);
      const end = new Date(br.breakEnd);
      return total + Math.floor((end - start) / 60000);
    }
    return total;
  }, 0);
};

// productive hours calculation
const calculateProductiveHours = (punchIn, punchOut, breaks) => {
  if (!punchIn || !punchOut) return "--";
  const start = new Date(punchIn);
  const end = new Date(punchOut);
  const totalMinutes = Math.floor((end - start) / 60000);
  const breakMinutes = calculateTotalBreakMinutes(breaks);
  const productiveMinutes = Math.max(totalMinutes - breakMinutes, 0);
  const hrs = Math.floor(productiveMinutes / 60);
  const mins = productiveMinutes % 60;
  return `${hrs}h ${mins}m`;
};

const AttendanceHistoryTable = ({ history = [], isAdmin }) => {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("date");
  const [selected, setSelected] = useState([]);

  /* ---------- Sorting ---------- */

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const descendingComparator = (a, b, orderBy) => {
    const aVal = a[orderBy] ?? "";
    const bVal = b[orderBy] ?? "";

    if (typeof aVal === "string") return bVal.localeCompare(aVal);
    return bVal > aVal ? 1 : -1;
  };

  const getComparator = () =>
    order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);

  /* ---------- Normalize API Data ---------- */

  const formattedData = useMemo(() => {
    return history.map((item) => {
      const breakMinutes = calculateTotalBreakMinutes(item.breaks);

      return {
        id: item._id,
        name: item?.user?.name || "",
        date: item.date,
        punchInTime: item.punchIn?.time,
        punchOutTime: item.punchOut?.time || null,
        breakMinutes,
        productiveHours: calculateProductiveHours(
          item.punchIn?.time,
          item.punchOut?.time,
          item.breaks,
        ),
        location: item.punchIn?.location?.address || "Unknown Location",
      };
    });
  }, [history]);

  const sortedData = useMemo(() => {
    return [...formattedData].sort(getComparator());
  }, [formattedData, order, orderBy]);

  /* ---------- Selection ---------- */

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(sortedData.map((r) => r.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const isSelected = (id) => selected.includes(id);

  return (
    <TableContainer className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHead className="sticky top-0 bg-[#f2f4f5] dark:bg-darkGray z-20">
            <TableRow>
              {isAdmin && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.length === sortedData.length}
                    indeterminate={
                      selected.length > 0 && selected.length < sortedData.length
                    }
                    onChange={handleSelectAll}
                    sx={checkboxSx}
                  />
                </TableCell>
              )}

              {[
                isAdmin && { id: "name", label: "Employee" },
                { id: "date", label: "Date" },
                { id: "punchInTime", label: "Punch In" },
                { id: "breakMinutes", label: "Break" },
                { id: "punchOutTime", label: "Punch Out" },
                { id: "productiveHours", label: "Productive Hours" },
                { id: "location", label: "Location" },
                { id: "workFrom", label: "WorkFrom" },
              ]
                .filter(Boolean)
                .map((col) => (
                  <TableCell
                    key={col.id}
                    sortDirection={orderBy === col.id ? order : false}
                    className="font-bold text-gray-700 dark:text-gray-200"
                  >
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => handleRequestSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((row) => {
                const checked = isSelected(row.id);

                return (
                  <TableRow
                    key={row.id}
                    hover
                    selected={checked}
                    className="hover:bg-gray-50 dark:hover:bg-darkGray"
                  >
                    {isAdmin && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={checked}
                          onChange={() => handleSelectRow(row.id)}
                          sx={checkboxSx}
                        />
                      </TableCell>
                    )}

                    {isAdmin && (
                      <TableCell className="capitalize dark:text-gray-300">
                        {row.name}
                      </TableCell>
                    )}

                    <TableCell className="dark:text-gray-300">
                      {formatDate(row.date)}
                    </TableCell>

                    <TableCell className="dark:text-gray-300">
                      {formatTime(row.punchInTime)}
                    </TableCell>

                    <TableCell className="dark:text-gray-300">
                      {row.breakMinutes} min
                    </TableCell>

                    <TableCell className="dark:text-gray-300">
                      {formatTime(row.punchOutTime)}
                    </TableCell>

                    <TableCell className="dark:text-gray-300 ">
                      {row.productiveHours}
                    </TableCell>

                    <TableCell>
                      <MdLocationOff
                        size={16}
                        title={row.location}
                        className="text-gray-500 dark:text-gray-300 cursor-pointer"
                      />
                    </TableCell>

                    <TableCell className="dark:text-gray-300">Office</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="py-10 text-center">
                  <NoData title="No Data Found" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </TableContainer>
  );
};

export default AttendanceHistoryTable;

// import React, { useState, useMemo } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   Coffee,
//   MapPin,
//   Calendar as CalendarIcon,
// } from "lucide-react";

// const formatTime = (date) => {
//   if (!date) return null;
//   return new Date(date).toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

// const calculateTotalBreakMinutes = (breaks = []) => {
//   return breaks.reduce((total, br) => {
//     if (br.duration) return total + br.duration;
//     if (br.breakStart && br.breakEnd) {
//       const start = new Date(br.breakStart);
//       const end = new Date(br.breakEnd);
//       return total + Math.floor((end - start) / 60000);
//     }
//     return total;
//   }, 0);
// };

// const calculateProductiveHours = (punchIn, punchOut, breaks) => {
//   if (!punchIn || !punchOut) return null;
//   const start = new Date(punchIn);
//   const end = new Date(punchOut);
//   const totalMinutes = Math.floor((end - start) / 60000);
//   const breakMinutes = calculateTotalBreakMinutes(breaks);
//   const productiveMinutes = Math.max(totalMinutes - breakMinutes, 0);
//   const hrs = Math.floor(productiveMinutes / 60);
//   const mins = productiveMinutes % 60;
//   return `${hrs}h ${mins}m`;
// };

// const AttendanceHistoryTable = ({ history = [], isAdmin }) => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);

//   // Group attendance by date
//   const attendanceByDate = useMemo(() => {
//     const grouped = {};
//     history.forEach((item) => {
//       const dateKey = new Date(item.date).toDateString();
//       if (!grouped[dateKey]) {
//         grouped[dateKey] = [];
//       }
//       grouped[dateKey].push({
//         id: item._id,
//         name: item?.user?.name || "",
//         punchIn: item.punchIn?.time,
//         punchOut: item.punchOut?.time,
//         breaks: item.breaks || [],
//         location: item.punchIn?.location?.address || "Unknown Location",
//         breakMinutes: calculateTotalBreakMinutes(item.breaks),
//         productiveHours: calculateProductiveHours(
//           item.punchIn?.time,
//           item.punchOut?.time,
//           item.breaks,
//         ),
//       });
//     });
//     return grouped;
//   }, [history]);

//   // Get calendar days
//   const calendarDays = useMemo(() => {
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const startingDayOfWeek = firstDay.getDay();
//     const daysInMonth = lastDay.getDate();

//     const days = [];

//     // Add empty cells for days before month starts
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }

//     // Add all days in month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month, day);
//       const dateKey = date.toDateString();
//       const attendanceData = attendanceByDate[dateKey] || [];
//       days.push({
//         date,
//         day,
//         dateKey,
//         attendance: attendanceData,
//         hasData: attendanceData.length > 0,
//       });
//     }

//     return days;
//   }, [currentDate, attendanceByDate]);

//   const monthName = currentDate.toLocaleDateString("en-US", {
//     month: "long",
//     year: "numeric",
//   });

//   const goToPreviousMonth = () => {
//     setCurrentDate(
//       new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
//     );
//   };

//   const goToNextMonth = () => {
//     setCurrentDate(
//       new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
//     );
//   };

//   const goToToday = () => {
//     setCurrentDate(new Date());
//   };

//   const isToday = (date) => {
//     if (!date) return false;
//     const today = new Date();
//     return date.toDateString() === today.toDateString();
//   };

//   const selectedDateData = selectedDate ? attendanceByDate[selectedDate] : null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

//         * {
//           font-family: 'Outfit', sans-serif;
//         }

//         .mono {
//           font-family: 'Space Mono', monospace;
//         }

//         .glass {
//           background: rgba(255, 255, 255, 0.7);
//           backdrop-filter: blur(12px);
//           border: 1px solid rgba(255, 255, 255, 0.8);
//         }

//         .calendar-day {
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .calendar-day:hover {
//           transform: translateY(-2px);
//         }

//         .event-badge {
//           animation: fadeIn 0.4s ease-out;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; transform: scale(0.9); }
//           to { opacity: 1; transform: scale(1); }
//         }

//         .pulse {
//           animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }

//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.5; }
//         }
//       `}</style>

//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="glass rounded-3xl p-6 mb-6 shadow-xl">
//           <div className="flex items-center justify-between flex-wrap gap-4">
//             <div>
//               <h1 className="text-4xl font-bold text-slate-800 mb-1">
//                 Attendance Calendar
//               </h1>
//               <p className="text-slate-600">
//                 Track and manage attendance records
//               </p>
//             </div>
//             <button
//               onClick={goToToday}
//               className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
//             >
//               <CalendarIcon className="w-5 h-5" />
//               Today
//             </button>
//           </div>
//         </div>

//         {/* Calendar Navigation */}
//         <div className="glass rounded-3xl p-6 mb-6 shadow-xl">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={goToPreviousMonth}
//               className="p-3 hover:bg-slate-200/50 rounded-xl transition-colors"
//               aria-label="Previous month"
//             >
//               <ChevronLeft className="w-6 h-6 text-slate-700" />
//             </button>

//             <h2 className="text-3xl font-bold text-slate-800 mono">
//               {monthName}
//             </h2>

//             <button
//               onClick={goToNextMonth}
//               className="p-3 hover:bg-slate-200/50 rounded-xl transition-colors"
//               aria-label="Next month"
//             >
//               <ChevronRight className="w-6 h-6 text-slate-700" />
//             </button>
//           </div>
//         </div>

//         {/* Calendar Grid */}
//         <div className="glass rounded-3xl p-6 mb-6 shadow-xl">
//           {/* Weekday Headers */}
//           <div className="grid grid-cols-7 gap-2 mb-4">
//             {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
//               <div
//                 key={day}
//                 className="text-center py-3 text-sm font-bold text-slate-600 tracking-wider"
//               >
//                 {day}
//               </div>
//             ))}
//           </div>

//           {/* Calendar Days */}
//           <div className="grid grid-cols-7 gap-2">
//             {calendarDays.map((dayData, index) => {
//               if (!dayData) {
//                 return <div key={`empty-${index}`} className="aspect-square" />;
//               }

//               const { date, day, dateKey, attendance, hasData } = dayData;
//               const today = isToday(date);
//               const isSelected = selectedDate === dateKey;

//               return (
//                 <button
//                   key={dateKey}
//                   onClick={() => setSelectedDate(isSelected ? null : dateKey)}
//                   className={`calendar-day aspect-square p-2 rounded-2xl text-left relative overflow-hidden ${
//                     today
//                       ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg"
//                       : hasData
//                         ? "bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100"
//                         : "bg-white hover:bg-slate-50"
//                   } ${
//                     isSelected ? "ring-4 ring-blue-400 shadow-xl" : ""
//                   } border border-slate-200 shadow-sm`}
//                 >
//                   <div className="relative z-10">
//                     <div
//                       className={`text-lg font-bold mb-1 ${today ? "text-white" : "text-slate-800"}`}
//                     >
//                       {day}
//                     </div>

//                     {hasData && (
//                       <div className="space-y-1">
//                         {attendance.slice(0, 2).map((record, idx) => (
//                           <div
//                             key={idx}
//                             className={`event-badge text-xs px-2 py-1 rounded-lg font-medium truncate ${
//                               today
//                                 ? "bg-white/20 text-white"
//                                 : "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
//                             }`}
//                             style={{ animationDelay: `${idx * 0.1}s` }}
//                           >
//                             {isAdmin ? record.name : formatTime(record.punchIn)}
//                           </div>
//                         ))}
//                         {attendance.length > 2 && (
//                           <div
//                             className={`text-xs font-bold ${today ? "text-white" : "text-slate-600"}`}
//                           >
//                             +{attendance.length - 2} more
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {today && (
//                     <div className="absolute top-1 right-1">
//                       <div className="w-2 h-2 bg-white rounded-full pulse" />
//                     </div>
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Selected Date Details */}
//         {selectedDateData && (
//           <div className="glass rounded-3xl p-6 shadow-xl">
//             <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
//               <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
//               Details for{" "}
//               {new Date(selectedDate).toLocaleDateString("en-US", {
//                 weekday: "long",
//                 month: "long",
//                 day: "numeric",
//                 year: "numeric",
//               })}
//             </h3>

//             <div className="space-y-4">
//               {selectedDateData.map((record, idx) => (
//                 <div
//                   key={record.id}
//                   className="bg-gradient-to-r from-white to-slate-50 rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
//                   style={{ animationDelay: `${idx * 0.1}s` }}
//                 >
//                   {isAdmin && (
//                     <div className="text-lg font-bold text-slate-800 mb-3">
//                       {record.name}
//                     </div>
//                   )}

//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <div className="flex items-start gap-3">
//                       <div className="p-2 bg-blue-100 rounded-lg">
//                         <Clock className="w-5 h-5 text-blue-600" />
//                       </div>
//                       <div>
//                         <div className="text-xs text-slate-600 font-medium mb-1">
//                           Punch In
//                         </div>
//                         <div className="text-sm font-bold text-slate-800 mono">
//                           {formatTime(record.punchIn) || "--"}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <div className="p-2 bg-purple-100 rounded-lg">
//                         <Clock className="w-5 h-5 text-purple-600" />
//                       </div>
//                       <div>
//                         <div className="text-xs text-slate-600 font-medium mb-1">
//                           Punch Out
//                         </div>
//                         <div className="text-sm font-bold text-slate-800 mono">
//                           {formatTime(record.punchOut) || "--"}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <div className="p-2 bg-orange-100 rounded-lg">
//                         <Coffee className="w-5 h-5 text-orange-600" />
//                       </div>
//                       <div>
//                         <div className="text-xs text-slate-600 font-medium mb-1">
//                           Break Time
//                         </div>
//                         <div className="text-sm font-bold text-slate-800 mono">
//                           {record.breakMinutes} min
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <div className="p-2 bg-green-100 rounded-lg">
//                         <Clock className="w-5 h-5 text-green-600" />
//                       </div>
//                       <div>
//                         <div className="text-xs text-slate-600 font-medium mb-1">
//                           Productive
//                         </div>
//                         <div className="text-sm font-bold text-slate-800 mono">
//                           {record.productiveHours || "--"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
//                     <MapPin className="w-4 h-4" />
//                     <span>{record.location}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Legend */}
//         <div className="glass rounded-3xl p-6 mt-6 shadow-xl">
//           <h3 className="text-lg font-bold text-slate-800 mb-4">Legend</h3>
//           <div className="flex flex-wrap gap-4">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded" />
//               <span className="text-sm text-slate-700">Today</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded border border-slate-200" />
//               <span className="text-sm text-slate-700">Has Attendance</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-white rounded border border-slate-200" />
//               <span className="text-sm text-slate-700">No Data</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendanceHistoryTable;
