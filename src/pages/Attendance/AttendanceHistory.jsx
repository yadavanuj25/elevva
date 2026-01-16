// import { useState } from "react";
// import { attendanceData } from "../../contstants/attendanceData";
// import AttendanceFilters from "../../components/attendance/AttendanceFilters";
// import AttendanceTable from "../../components/attendance/AttendanceTable";

// import { attendanceFilters } from "../../utils/attendanceFilters";

// const AttendanceHistory = () => {
//   const role = "ADMIN"; // USER | ADMIN
//   const loggedInUserId = "EMP001";

//   const [filters, setFilters] = useState({
//     monthType: "current",
//     startDate: "",
//     endDate: "",
//     employee: "",
//   });

//   const [history, setHistory] = useState([]);

//   const handleApplyFilters = () => {
//     const result = attendanceFilters(
//       attendanceData,
//       filters,
//       role,
//       loggedInUserId
//     );
//     setHistory(result);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-xl font-semibold">Attendance History</h2>

//       <AttendanceFilters
//         filters={filters}
//         setFilters={setFilters}
//         onApply={handleApplyFilters}
//         isAdmin={role === "ADMIN"}
//       />

//       <AttendanceTable data={history} isAdmin={role === "ADMIN"} />
//     </div>
//   );
// };

// export default AttendanceHistory;
import { useState, useEffect } from "react";
import AttendanceFilters from "../../components/attendance/AttendanceFilters";
import AttendanceTable from "../../components/attendance/AttendanceTable";
import { attendanceFilters } from "../../utils/attendanceFilters";
import { useAttendance } from "../../context/AttendanceContext";

const AttendanceHistory = () => {
  const role = "ADMIN"; // USER | ADMIN
  const loggedInUserId = "EMP001";

  const { attendanceData } = useAttendance();

  const [filters, setFilters] = useState({
    monthType: "all", // ✅ IMPORTANT FIX
    startDate: "",
    endDate: "",
    employee: "",
  });

  const [history, setHistory] = useState([]);

  const handleApplyFilters = () => {
    const result = attendanceFilters(
      attendanceData,
      filters,
      role,
      loggedInUserId
    );
    setHistory(result);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold ">Attendance History</h2>
      </div>
      <AttendanceFilters
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
        isAdmin={role === "ADMIN"}
      />

      <AttendanceTable data={history} isAdmin={role === "ADMIN"} />
    </div>
  );
};

export default AttendanceHistory;
