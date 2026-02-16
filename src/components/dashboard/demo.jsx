import { Cake, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { getBirthday } from "../../services/birthDayServices";

export const BirthdayCalendar = ({
  birthdays,
  currentMonth,
  currentYear,
  onMonthChange,
}) => {
  const [birthdayData, setBirthdayData] = useState([]);

  const monthNames = [
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

  useEffect(() => {
    fetchBirthDays();
  }, []);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const days = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Add days of month
  for (let i = 1; i <= days; i++) {
    calendarDays.push(i);
  }

  const getBirthdaysForDay = (day) => {
    if (!day || !birthdayData) return [];
    return birthdayData.filter((b) => {
      const bDay = new Date(b.dateOfBirth);
      return bDay.getDate() === day && bDay.getMonth() === currentMonth;
    });
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const fetchBirthDays = async () => {
    try {
      const res = await getBirthday({
        year: currentYear,
        month: currentMonth + 1,
      });

      setBirthdayData(res?.birthdays || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Birthday Calendar
          </h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onMonthChange("prev")}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold text-lg">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={() => onMonthChange("next")}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-600 py-2"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((day, idx) => {
            const dayBirthdays = getBirthdaysForDay(day);
            const hasBirthday = dayBirthdays.length > 0;
            const todayFlag = isToday(day);

            return (
              <div
                key={idx}
                className={`aspect-square p-2 border rounded-lg relative ${
                  !day
                    ? "bg-gray-50"
                    : todayFlag
                      ? "bg-blue-50 border-blue-500 border-2"
                      : hasBirthday
                        ? "bg-pink-50 border-pink-300"
                        : "hover:bg-gray-50"
                }`}
              >
                {day && (
                  <>
                    <div
                      className={`text-sm font-semibold ${todayFlag ? "text-blue-600" : "text-gray-700"}`}
                    >
                      {day}
                    </div>
                    {hasBirthday && (
                      <div className="absolute bottom-1 right-1">
                        <div className="relative group">
                          <Cake
                            size={16}
                            className="text-pink-500 animate-bounce"
                          />
                          <div className="absolute bottom-6 right-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                            {dayBirthdays
                              .map((b) => `${b.fullName}`)
                              .join(", ")}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 border-2 border-blue-500 rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-50 border border-pink-300 rounded"></div>
            <span>Birthday</span>
          </div>
        </div>
      </div>
    </>
  );
};

// import { Cake, ChevronLeft, ChevronRight } from "lucide-react";
// import { useEffect, useState } from "react";
// import { getBirthday } from "../../services/birthDayServices";

// export const BirthdayCalendar = ({
//   currentMonth,
//   currentYear,
//   onMonthChange,
// }) => {
//   const [birthdayData, setBirthdayData] = useState([]);

//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   // ==============================
//   // FETCH BIRTHDAYS FROM API
//   // ==============================
//   const fetchBirthDays = async () => {
//     try {
//       const res = await getBirthday({
//         year: currentYear,
//         month: currentMonth + 1, // API expects 1-12 month
//       });

//       setBirthdayData(res.birthdays || []);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchBirthDays();
//   }, [currentMonth, currentYear]);

//   // ==============================
//   // CALENDAR HELPERS
//   // ==============================
//   const getDaysInMonth = (month, year) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (month, year) => {
//     return new Date(year, month, 1).getDay();
//   };

//   const days = getDaysInMonth(currentMonth, currentYear);
//   const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

//   const calendarDays = [];

//   for (let i = 0; i < firstDay; i++) {
//     calendarDays.push(null);
//   }

//   for (let i = 1; i <= days; i++) {
//     calendarDays.push(i);
//   }

//   // ==============================
//   // BIRTHDAY MATCHING
//   // ==============================
//   const getBirthdaysForDay = (day) => {
//     if (!day) return [];
//     return birthdayData.filter((b) => b.birthDay === day);
//   };

//   const isToday = (day) => {
//     const today = new Date();
//     return (
//       day === today.getDate() &&
//       currentMonth === today.getMonth() &&
//       currentYear === today.getFullYear()
//     );
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-2xl font-bold text-gray-800">Birthday Calendar</h3>

//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => onMonthChange("prev")}
//             className="p-2 hover:bg-gray-100 rounded-lg transition"
//           >
//             <ChevronLeft size={20} />
//           </button>

//           <span className="font-semibold text-lg">
//             {monthNames[currentMonth]} {currentYear}
//           </span>

//           <button
//             onClick={() => onMonthChange("next")}
//             className="p-2 hover:bg-gray-100 rounded-lg transition"
//           >
//             <ChevronRight size={20} />
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-7 gap-2">
//         {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//           <div
//             key={day}
//             className="text-center font-semibold text-gray-600 py-2"
//           >
//             {day}
//           </div>
//         ))}

//         {calendarDays.map((day, idx) => {
//           const dayBirthdays = getBirthdaysForDay(day);
//           const hasBirthday = dayBirthdays.length > 0;
//           const todayFlag = isToday(day);

//           return (
//             <div
//               key={idx}
//               className={`aspect-square p-2 border rounded-lg relative ${
//                 !day
//                   ? "bg-gray-50"
//                   : todayFlag
//                     ? "bg-blue-50 border-blue-500 border-2"
//                     : hasBirthday
//                       ? "bg-pink-50 border-pink-300"
//                       : "hover:bg-gray-50"
//               }`}
//             >
//               {day && (
//                 <>
//                   <div
//                     className={`text-sm font-semibold ${
//                       todayFlag ? "text-blue-600" : "text-gray-700"
//                     }`}
//                   >
//                     {day}
//                   </div>

//                   {hasBirthday && (
//                     <div className="absolute bottom-1 right-1">
//                       <div className="relative group">
//                         <Cake
//                           size={16}
//                           className="text-pink-500 animate-bounce"
//                         />

//                         {/* Tooltip */}
//                         <div className="absolute bottom-6 right-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
//                           {dayBirthdays.map((b) => b.fullName).join(", ")}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
//         <div className="flex items-center gap-2">
//           <div className="w-4 h-4 bg-blue-50 border-2 border-blue-500 rounded"></div>
//           <span>Today</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <div className="w-4 h-4 bg-pink-50 border border-pink-300 rounded"></div>
//           <span>Birthday</span>
//         </div>
//       </div>
//     </div>
//   );
// };
