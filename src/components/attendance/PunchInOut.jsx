// import React, { useState, useEffect } from "react";
// import { Clock } from "lucide-react";
// import { useAttendance } from "../../context/AttendanceContext";

// const PunchInOut = () => {
//   const { punch } = useAttendance();
//   const userId = "EMP001";
//   const name = "Anuj Yadav";
//   const [dateTime, setDateTime] = useState("");
//   const [punchInTime, setPunchInTime] = useState(null);
//   const [punchOutTime, setPunchOutTime] = useState(null);
//   const [totalHours, setTotalHours] = useState("00:00:00");
//   const [status, setStatus] = useState("Not Punched");

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = new Date();
//       setDateTime(
//         now.toLocaleTimeString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         }) +
//           ", " +
//           now.toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           })
//       );

//       if (punchInTime && !punchOutTime) {
//         const diff = now - punchInTime;
//         const h = Math.floor(diff / 3600000);
//         const m = Math.floor((diff % 3600000) / 60000);
//         const s = Math.floor((diff % 60000) / 1000);
//         setTotalHours(
//           `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
//             .toString()
//             .padStart(2, "0")}`
//         );
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [punchInTime, punchOutTime]);

//   const handlePunchIn = () => {
//     const now = new Date();
//     const shiftStart = getTodayTime(10, 0);
//     setPunchInTime(now);
//     setPunchOutTime(null);
//     setStatus(now > shiftStart ? "Late" : "On Time");
//     punch(userId, name, "in", now.toTimeString().slice(0, 5));
//   };

//   const handlePunchOut = () => {
//     const now = new Date();
//     const shiftEnd = getTodayTime(19, 0);
//     setPunchOutTime(now);
//     setStatus(now < shiftEnd ? "Early Leave" : "Completed");
//     punch(userId, name, "out", now.toTimeString().slice(0, 5));
//   };

//   const getTodayTime = (hours, minutes = 0) => {
//     const d = new Date();
//     d.setHours(hours, minutes, 0, 0);
//     return d;
//   };

//   const getStatusColor = () => {
//     switch (status) {
//       case "Late":
//         return "text-orange-600";
//       case "Early Leave":
//         return "text-red-600";
//       case "On Time":
//       case "Completed":
//         return "text-green-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   return (
//     <div>
//       <h3 className="text-center text-gray-600 dark:text-gray-300 font-medium">
//         Attendance
//       </h3>
//       <p className="text-center text-lg font-semibold mb-4">{dateTime}</p>
//       <div className="flex justify-center mt-6">
//         <div
//           className="relative w-40 h-40 rounded-full"
//           style={{
//             background: "conic-gradient(#22c55e 60%, #e5e7eb 0)",
//           }}
//         >
//           <div className="absolute inset-3 bg-white dark:bg-gray-900 rounded-full flex flex-col items-center justify-center">
//             <p className="text-gray-500 dark:text-gray-400 text-sm">
//               Total Hours
//             </p>
//             <p className="font-bold text-lg text-gray-900 dark:text-white">
//               {totalHours}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center justify-center text-sm mb-2 mt-4 gap-2">
//         <Clock className="w-4 h-4" />
//         {punchInTime
//           ? `Punch In: ${punchInTime.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}`
//           : "Not Punched In"}
//       </div>

//       <p className={`text-center font-semibold mb-2 ${getStatusColor()}`}>
//         Status: {status}
//       </p>

//       <div className="flex flex-col gap-3">
//         {!punchInTime && (
//           <button
//             onClick={handlePunchIn}
//             className="w-full py-2 bg-green-500 text-white rounded-lg"
//           >
//             Punch In
//           </button>
//         )}
//         {punchInTime && !punchOutTime && (
//           <button
//             onClick={handlePunchOut}
//             className="w-full py-2 bg-red-500 text-white rounded-lg"
//           >
//             Punch Out
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PunchInOut;

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { useAttendance } from "../../context/AttendanceContext";
import { useAuth } from "../../auth/AuthContext";

const DAILY_WORK_MINUTES = 9 * 60; // 9 hours
const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const timeToMinutes = (time) => {
  const [h, m, s] = time.split(":").map(Number);
  return h * 60 + m + Math.floor(s / 60);
};

const PunchInOut = () => {
  const { punch } = useAttendance();
  const { user } = useAuth();
  const userId = user?._id;
  const name = user?.fullName;
  const [dateTime, setDateTime] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [lunchStartTime, setLunchStartTime] = useState(null);
  const [lunchEndTime, setLunchEndTime] = useState(null);
  const [totalLunchMs, setTotalLunchMs] = useState(0);
  const [totalHours, setTotalHours] = useState("00:00:00");
  const [status, setStatus] = useState("Not Punched");

  const workedMinutes = timeToMinutes(totalHours);

  const progressPercent = Math.min(
    Math.round((workedMinutes / DAILY_WORK_MINUTES) * 100),
    100
  );

  const strokeOffset = CIRCUMFERENCE - (progressPercent / 100) * CIRCUMFERENCE;

  /* ---------------- helpers ---------------- */
  const getTodayTime = (h, m = 0) => {
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  /* ---------------- clock + auto reset ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      if (now.toDateString() !== currentDate) {
        setPunchInTime(null);
        setPunchOutTime(null);
        setLunchStartTime(null);
        setLunchEndTime(null);
        setTotalLunchMs(0);
        setTotalHours("00:00:00");
        setStatus("Not Punched");
        setCurrentDate(now.toDateString());
      }

      setDateTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );

      if (punchInTime && !punchOutTime) {
        let diff = now - punchInTime - totalLunchMs;

        if (lunchStartTime && !lunchEndTime) {
          diff -= now - lunchStartTime;
        }

        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        setTotalHours(
          `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    punchInTime,
    punchOutTime,
    lunchStartTime,
    lunchEndTime,
    totalLunchMs,
    currentDate,
  ]);

  /* ---------------- actions ---------------- */
  const handlePunchIn = () => {
    const now = new Date();
    const graceLimit = getTodayTime(10, 10);
    setPunchInTime(now);
    setStatus(now > graceLimit ? "Late" : "On Time");
    punch(userId, name, "in", now.toTimeString().slice(0, 5));
  };

  const handleLunchStart = () => {
    const now = new Date();
    setLunchStartTime(now);

    punch(userId, name, "lunchStart", now.toTimeString().slice(0, 5));
  };

  const handleLunchEnd = () => {
    const now = new Date();
    const diffMinutes = Math.floor((now - lunchStartTime) / 60000);

    setLunchEndTime(now);
    setTotalLunchMs((prev) => prev + diffMinutes * 60000);
    setLunchStartTime(null);

    punch(userId, name, "lunchEnd", now.toTimeString().slice(0, 5), {
      lunchMinutes: diffMinutes,
    });
  };

  const handlePunchOut = () => {
    const now = new Date();
    setPunchOutTime(now);

    const workedMs = now - punchInTime - totalLunchMs;
    const workedHours = workedMs / 3600000;

    let finalStatus = "Completed";
    if (workedHours < 4.5) finalStatus = "Half Day";
    else if (now < getTodayTime(19, 0)) finalStatus = "Early Leave";

    setStatus(finalStatus);
    punch(userId, name, "out", now.toTimeString().slice(0, 5), finalStatus);
  };

  const getStatusColor = () => {
    switch (status) {
      case "Late":
        return "text-orange-600";
      case "Early Leave":
      case "Half Day":
        return "text-red-600";
      case "On Time":
      case "Completed":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div>
      <h3 className="text-center font-medium">Welcome {name}</h3>
      <p className="text-center font-semibold mb-4">{dateTime}</p>
      <div className="flex justify-center mt-2">
        <div className="flex justify-center mt-6">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg
              width="180"
              height="180"
              viewBox="0 0 180 180"
              className="absolute"
            >
              {/* Background circle */}
              <circle
                cx="90"
                cy="90"
                r={RADIUS}
                stroke="#e5e7eb"
                strokeWidth="5"
                fill="none"
              />

              {/* Progress circle */}
              <circle
                cx="90"
                cy="90"
                r={RADIUS}
                stroke="#22c55e"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeOffset}
                transform="rotate(-90 90 90)"
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>

            {/* Inner content */}
            <div className="w-36 h-36  rounded-full flex flex-col items-center justify-center shadow">
              <p className="text-sm font-semibold">Total Hours</p>
              <p className="font-bold text-lg">{totalHours}</p>
              <p className="text-xs text-green-600 font-semibold">
                {progressPercent}%
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className={`text-center font-semibold my-2 ${getStatusColor()}`}>
        Status: {status}
      </p>
      <div className="flex flex-col gap-3">
        {!punchInTime && (
          <button
            onClick={handlePunchIn}
            className="bg-accent-dark text-white py-2 rounded-lg"
          >
            Punch In
          </button>
        )}
        {punchInTime && !lunchStartTime && !lunchEndTime && !punchOutTime && (
          <button
            onClick={handleLunchStart}
            className="bg-yellow-500 text-white py-2 rounded-lg"
          >
            Start Lunch Break
          </button>
        )}
        {lunchStartTime && (
          <button
            onClick={handleLunchEnd}
            className="bg-blue-500 text-white py-2 rounded-lg"
          >
            End Lunch Break
          </button>
        )}
        {punchInTime && !punchOutTime && !lunchStartTime && (
          <button
            onClick={handlePunchOut}
            className="bg-accent-dark text-white py-2 rounded-lg"
          >
            Punch Out
          </button>
        )}
      </div>
    </div>
  );
};

export default PunchInOut;
