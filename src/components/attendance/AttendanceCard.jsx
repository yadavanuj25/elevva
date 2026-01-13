import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const AttendanceCard = () => {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const date = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      setDateTime(`${time}, ${date}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3 className="text-center text-gray-600 dark:text-gray-300 font-medium">
        Attendance
      </h3>
      <p className="text-center text-lg font-semibold mb-4">{dateTime}</p>

      <div className="flex justify-center mt-6">
        <div
          className="relative w-40 h-40 rounded-full"
          style={{
            background: "conic-gradient(#22c55e 75%, #e5e7eb 0)",
          }}
        >
          <div className="absolute inset-3 bg-white dark:bg-gray-900 rounded-full flex flex-col items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Total Hours
            </p>
            <p className="font-bold text-lg text-gray-900 dark:text-white">
              5:45:32
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
        <Clock className="w-4 h-4" />
        Punch In at 10:00 AM
      </div>

      <button
        className="w-full flex items-center justify-center font-semibold py-2 rounded-lg
                   bg-accent-dark text-white hover:opacity-80 
                    transition-colors"
      >
        Punch Out
      </button>
    </div>
  );
};

export default AttendanceCard;
