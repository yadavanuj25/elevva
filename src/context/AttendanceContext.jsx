// import React, { useEffect, createContext, useState, useContext } from "react";
// import { attendanceData as initialData } from "../contstants/attendanceData";

// const AttendanceContext = createContext();

// export const useAttendance = () => useContext(AttendanceContext);

// const todayStr = () => {
//   const d = new Date();
//   d.setHours(0, 0, 0, 0);
//   return d.toISOString().split("T")[0];
// };

// export const AttendanceProvider = ({ children }) => {
//   const [attendanceData, setAttendanceData] = useState(() => {
//     const saved = localStorage.getItem("attendanceData");
//     return saved ? JSON.parse(saved) : initialData;
//   });

//   useEffect(() => {
//     localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
//   }, [attendanceData]);

//   const punch = (userId, name, punchType, time, extra = {}) => {
//     const today = todayStr();
//     const newData = [...attendanceData];

//     const index = newData.findIndex(
//       (i) => i.userId === userId && i.date === today
//     );

//     let record =
//       index !== -1
//         ? { ...newData[index] }
//         : {
//             userId,
//             name,
//             date: today,
//             punchIn: null,
//             punchOut: null,
//             lunchStart: null,
//             lunchEnd: null,
//             lunchDuration: 0,
//             totalWorkMinutes: 0,
//             totalHours: "00:00",
//             status: "Absent",
//           };

//     if (punchType === "in") {
//       record.punchIn = time;
//       record.status = "Present";
//     }

//     if (punchType === "lunchStart") {
//       record.lunchStart = time;
//     }

//     if (punchType === "lunchEnd") {
//       record.lunchEnd = time;
//       record.lunchDuration = extra.lunchMinutes;
//     }

//     if (punchType === "out") {
//       record.punchOut = time;

//       const start = new Date(`1970-01-01T${record.punchIn}:00`);
//       const end = new Date(`1970-01-01T${time}:00`);
//       const totalMinutes = (end - start) / 60000 - record.lunchDuration;
//       record.totalWorkMinutes = Math.max(totalMinutes, 0);
//       const h = Math.floor(record.totalWorkMinutes / 60);
//       const m = record.totalWorkMinutes % 60;
//       record.totalHours = `${h.toString().padStart(2, "0")}:${m
//         .toString()
//         .padStart(2, "0")}`;
//       record.status = extra.status || "Completed";
//     }
//     if (index !== -1) newData[index] = record;
//     else newData.push(record);
//     setAttendanceData(newData);
//   };

//   return (
//     <AttendanceContext.Provider value={{ attendanceData, punch }}>
//       {children}
//     </AttendanceContext.Provider>
//   );
// };

import React, { useEffect, createContext, useState, useContext } from "react";
import { attendanceData as initialData } from "../contstants/attendanceData";

const AttendanceContext = createContext();
export const useAttendance = () => useContext(AttendanceContext);

const todayStr = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
};

const SHIFT_START = "10:00";
const GRACE_MINUTES = 10;

const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const AttendanceProvider = ({ children }) => {
  const [attendanceData, setAttendanceData] = useState(() => {
    const saved = localStorage.getItem("attendanceData");
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
  }, [attendanceData]);

  const punch = (userId, name, punchType, time, extra = {}) => {
    const today = todayStr();
    const newData = [...attendanceData];
    const index = newData.findIndex(
      (i) => i.userId === userId && i.date === today
    );

    let record =
      index !== -1
        ? { ...newData[index] }
        : {
            userId,
            name,
            date: today,
            punchIn: null,
            punchOut: null,
            lunchStart: null,
            lunchEnd: null,
            lunchDuration: 0,
            totalWorkMinutes: 0,
            totalHours: "00:00",
            status: "Absent",
            isLate: false,
            lateMinutes: 0,
            lateTime: null,
          };

    if (punchType === "in") {
      record.punchIn = time;
      const punchMinutes = timeToMinutes(time);
      const lateThreshold = timeToMinutes(SHIFT_START) + GRACE_MINUTES;
      if (punchMinutes > lateThreshold) {
        record.isLate = true;
        record.lateMinutes = punchMinutes - lateThreshold;
        record.lateTime = `${Math.floor(record.lateMinutes / 60)
          .toString()
          .padStart(2, "0")}:${(record.lateMinutes % 60)
          .toString()
          .padStart(2, "0")}`;
        record.status = "Present";
      } else {
        record.isLate = false;
        record.lateMinutes = 0;
        record.lateTime = null;
        record.status = "Absent";
      }
    }

    /* ---------- LUNCH ---------- */
    if (punchType === "lunchStart") {
      record.lunchStart = time;
    }

    if (punchType === "lunchEnd") {
      record.lunchEnd = time;
      record.lunchDuration = extra.lunchMinutes;
    }

    /* ---------- PUNCH OUT ---------- */
    if (punchType === "out") {
      record.punchOut = time;

      const start = new Date(`1970-01-01T${record.punchIn}:00`);
      const end = new Date(`1970-01-01T${time}:00`);
      const totalMinutes = (end - start) / 60000 - record.lunchDuration;

      record.totalWorkMinutes = Math.max(totalMinutes, 0);

      const h = Math.floor(record.totalWorkMinutes / 60);
      const m = record.totalWorkMinutes % 60;

      record.totalHours = `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;

      if (!record.isLate) record.status = "Completed";
    }

    if (index !== -1) newData[index] = record;
    else newData.push(record);

    setAttendanceData(newData);
  };

  return (
    <AttendanceContext.Provider value={{ attendanceData, punch }}>
      {children}
    </AttendanceContext.Provider>
  );
};
