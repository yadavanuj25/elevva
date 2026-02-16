import { Cake, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getBirthday } from "../../services/birthDayServices";
import { swalError } from "../../utils/swalHelper";

const BirthdayCalendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
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
  }, [currentMonth, currentYear]);

  const fetchBirthDays = async () => {
    try {
      const res = await getBirthday({
        year: currentYear,
        month: currentMonth + 1,
      });
      setBirthdayData(res?.birthdays || []);
    } catch (error) {
      console.error(error.message);
    }
  };

  const changeMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    }

    if (direction === "next") {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((prev) => prev + 1);
      } else {
        setCurrentMonth((prev) => prev + 1);
      }
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const days = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= days; i++) {
    calendarDays.push(i);
  }

  const getBirthdaysForDay = (day) => {
    if (!day) return [];
    return birthdayData.filter((b) => b.birthDay === day);
  };

  const isToday = (day) => {
    const now = new Date();
    return (
      day === now.getDate() &&
      currentMonth === now.getMonth() &&
      currentYear === now.getFullYear()
    );
  };

  return (
    <div className="rounded-2xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4 ">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold ">Birthday Calendar</h3>

        <div className="flex items-center gap-4">
          <button
            onClick={() => changeMonth("prev")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="font-semibold text-lg">
            {monthNames[currentMonth]} {currentYear}
          </span>

          <button
            onClick={() => changeMonth("next")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* WEEK DAYS */}
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}

        {/* CALENDAR CELLS */}
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
                    className={`text-sm font-semibold ${
                      todayFlag ? "text-blue-600" : "text-gray-700"
                    }`}
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

                        {/* TOOLTIP */}
                        <div className="absolute bottom-6 right-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          {dayBirthdays.map((b) => b.fullName).join(", ")}
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

      {/* LEGEND */}
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
  );
};

export default BirthdayCalendar;
