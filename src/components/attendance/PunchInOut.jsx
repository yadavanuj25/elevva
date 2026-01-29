// import React, { useState, useEffect } from "react";
// import { Clock } from "lucide-react";
// import { useAttendance } from "../../context/AttendanceContext";
// import { useAuth } from "../../auth/AuthContext";

// const DAILY_WORK_MINUTES = 9 * 60; // 9 hours
// const RADIUS = 70;
// const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// const timeToMinutes = (time) => {
//   const [h, m, s] = time.split(":").map(Number);
//   return h * 60 + m + Math.floor(s / 60);
// };

// const PunchInOut = () => {
//   const { punch } = useAttendance();
//   const { user } = useAuth();
//   const userId = user?._id;
//   const name = user?.fullName;
//   const [dateTime, setDateTime] = useState("");
//   const [currentDate, setCurrentDate] = useState(new Date().toDateString());
//   const [punchInTime, setPunchInTime] = useState(null);
//   const [punchOutTime, setPunchOutTime] = useState(null);
//   const [lunchStartTime, setLunchStartTime] = useState(null);
//   const [lunchEndTime, setLunchEndTime] = useState(null);
//   const [totalLunchMs, setTotalLunchMs] = useState(0);
//   const [totalHours, setTotalHours] = useState("00:00:00");
//   const [status, setStatus] = useState("Not Punched");

//   const workedMinutes = timeToMinutes(totalHours);

//   const progressPercent = Math.min(
//     Math.round((workedMinutes / DAILY_WORK_MINUTES) * 100),
//     100,
//   );

//   const strokeOffset = CIRCUMFERENCE - (progressPercent / 100) * CIRCUMFERENCE;

//   /* ---------------- helpers ---------------- */
//   const getTodayTime = (h, m = 0) => {
//     const d = new Date();
//     d.setHours(h, m, 0, 0);
//     return d;
//   };

//   /* ---------------- clock + auto reset ---------------- */
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = new Date();

//       if (now.toDateString() !== currentDate) {
//         setPunchInTime(null);
//         setPunchOutTime(null);
//         setLunchStartTime(null);
//         setLunchEndTime(null);
//         setTotalLunchMs(0);
//         setTotalHours("00:00:00");
//         setStatus("Not Punched");
//         setCurrentDate(now.toDateString());
//       }

//       setDateTime(
//         now.toLocaleTimeString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         }),
//       );

//       if (punchInTime && !punchOutTime) {
//         let diff = now - punchInTime - totalLunchMs;

//         if (lunchStartTime && !lunchEndTime) {
//           diff -= now - lunchStartTime;
//         }

//         const h = Math.floor(diff / 3600000);
//         const m = Math.floor((diff % 3600000) / 60000);
//         const s = Math.floor((diff % 60000) / 1000);

//         setTotalHours(
//           `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
//             .toString()
//             .padStart(2, "0")}`,
//         );
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [
//     punchInTime,
//     punchOutTime,
//     lunchStartTime,
//     lunchEndTime,
//     totalLunchMs,
//     currentDate,
//   ]);

//   /* ---------------- actions ---------------- */
//   const handlePunchIn = () => {
//     const now = new Date();
//     const graceLimit = getTodayTime(10, 10);
//     setPunchInTime(now);
//     setStatus(now > graceLimit ? "Late" : "On Time");
//     punch(userId, name, "in", now.toTimeString().slice(0, 5));
//   };

//   const handleLunchStart = () => {
//     const now = new Date();
//     setLunchStartTime(now);

//     punch(userId, name, "lunchStart", now.toTimeString().slice(0, 5));
//   };

//   const handleLunchEnd = () => {
//     const now = new Date();
//     const diffMinutes = Math.floor((now - lunchStartTime) / 60000);

//     setLunchEndTime(now);
//     setTotalLunchMs((prev) => prev + diffMinutes * 60000);
//     setLunchStartTime(null);

//     punch(userId, name, "lunchEnd", now.toTimeString().slice(0, 5), {
//       lunchMinutes: diffMinutes,
//     });
//   };

//   const handlePunchOut = () => {
//     const now = new Date();
//     setPunchOutTime(now);

//     const workedMs = now - punchInTime - totalLunchMs;
//     const workedHours = workedMs / 3600000;

//     let finalStatus = "Completed";
//     if (workedHours < 4.5) finalStatus = "Half Day";
//     else if (now < getTodayTime(19, 0)) finalStatus = "Early Leave";

//     setStatus(finalStatus);
//     punch(userId, name, "out", now.toTimeString().slice(0, 5), finalStatus);
//   };

//   const getStatusColor = () => {
//     switch (status) {
//       case "Late":
//         return "text-orange-600";
//       case "Early Leave":
//       case "Half Day":
//         return "text-red-600";
//       case "On Time":
//       case "Completed":
//         return "text-green-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div>
//       <h3 className="text-center font-medium">Welcome {name}</h3>
//       <p className="text-center font-semibold mb-4">{dateTime}</p>
//       <div className="flex justify-center mt-2">
//         <div className="flex justify-center mt-6">
//           <div className="relative w-44 h-44 flex items-center justify-center">
//             <svg
//               width="180"
//               height="180"
//               viewBox="0 0 180 180"
//               className="absolute"
//             >
//               {/* Background circle */}
//               <circle
//                 cx="90"
//                 cy="90"
//                 r={RADIUS}
//                 stroke="#e5e7eb"
//                 strokeWidth="5"
//                 fill="none"
//               />

//               {/* Progress circle */}
//               <circle
//                 cx="90"
//                 cy="90"
//                 r={RADIUS}
//                 stroke="#22c55e"
//                 strokeWidth="5"
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeDasharray={CIRCUMFERENCE}
//                 strokeDashoffset={strokeOffset}
//                 transform="rotate(-90 90 90)"
//                 style={{ transition: "stroke-dashoffset 0.5s ease" }}
//               />
//             </svg>

//             {/* Inner content */}
//             <div className="w-36 h-36  rounded-full flex flex-col items-center justify-center shadow">
//               <p className="text-sm font-semibold">Total Hours</p>
//               <p className="font-bold text-lg">{totalHours}</p>
//               <p className="text-xs text-green-600 font-semibold">
//                 {progressPercent}%
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <p className={`text-center font-semibold my-2 ${getStatusColor()}`}>
//         Status: {status}
//       </p>
//       <div className="flex flex-col gap-3">
//         {!punchInTime && (
//           <button
//             onClick={handlePunchIn}
//             className="bg-accent-dark text-white py-2 rounded-lg"
//           >
//             Punch In
//           </button>
//         )}
//         {punchInTime && !lunchStartTime && !lunchEndTime && !punchOutTime && (
//           <button
//             onClick={handleLunchStart}
//             className="bg-yellow-500 text-white py-2 rounded-lg"
//           >
//             Start Lunch Break
//           </button>
//         )}
//         {lunchStartTime && (
//           <button
//             onClick={handleLunchEnd}
//             className="bg-blue-500 text-white py-2 rounded-lg"
//           >
//             End Lunch Break
//           </button>
//         )}
//         {punchInTime && !punchOutTime && !lunchStartTime && (
//           <button
//             onClick={handlePunchOut}
//             className="bg-accent-dark text-white py-2 rounded-lg"
//           >
//             Punch Out
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Calendar,
  TrendingUp,
  LogIn,
  LogOut,
  Coffee,
  AlertCircle,
  CheckCircle,
  XCircle,
  Briefcase,
  Download,
  Filter,
} from "lucide-react";
import {
  endBreak,
  getAttendanceHistory,
  getTodayAttendance,
  punchIn,
  punchOut,
  startBreak,
} from "../../services/attendanceServices";

const PunchInOut = () => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [isPunchingIn, setIsPunchingIn] = useState(false);
  const [isPunchingOut, setIsPunchingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeBreak, setActiveBreak] = useState(null);
  const [isBreakActive, setIsBreakActive] = useState(false);

  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    page: 1,
    limit: 30,
  });

  useEffect(() => {
    fetchTodayAttendance();
    getLocation();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab, filters]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Location error:", error);
        },
      );
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const res = await getTodayAttendance();
      setTodayAttendance(res.data);
      if (res.data?.breaks) {
        const ongoingBreak = res.data.breaks.find((b) => !b.breakEnd);
        setIsBreakActive(!!ongoingBreak);
        setActiveBreak(ongoingBreak);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await getAttendanceHistory({
        startDate: filters.startDate,
        endDate: filters.endDate,
        page: filters.page,
        limit: filters.limit,
      });

      setHistory(res.data || []);
      setStats(res.stats || null);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handlePunchIn = async () => {
    if (!location) {
      alert("Please enable location access");
      return;
    }
    setIsPunchingIn(true);
    try {
      const payload = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
      const data = await punchIn(payload);
      if (data.success) {
        setTodayAttendance(data.data);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to punch in", error);
    }
    setIsPunchingIn(false);
  };

  const handlePunchOut = async () => {
    if (!location) {
      alert("Please enable location access");
      return;
    }

    setIsPunchingOut(true);
    try {
      const payload = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
      const response = await punchOut(payload);

      if (response.success) {
        setTodayAttendance(response.data);
        alert(
          `${response.message}\n\nWorking Hours: ${response.summary.workingHours} hrs\nOvertime: ${response.summary.overtimeHours} hrs`,
        );
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Failed to punch out");
    }
    setIsPunchingOut(false);
  };

  const handleStartBreak = async () => {
    try {
      const payload = { breakType: "lunch" };
      const response = await startBreak(payload);

      if (response.success) {
        setIsBreakActive(true);
        fetchTodayAttendance();
        alert("Break started");
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Failed to start break");
    }
  };

  const handleEndBreak = async () => {
    try {
      const response = await endBreak();
      if (response.success) {
        setIsBreakActive(false);
        fetchTodayAttendance();
        alert(response.message);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Failed to end break");
    }
  };

  const exportAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
      });

      const response = await fetch(
        `https://crm-backend-qbz0.onrender.com/api/attendance/export?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-${filters.startDate}-to-${filters.endDate}.csv`;
      a.click();
    } catch (error) {
      alert("Failed to export attendance");
    }
  };

  const formatTime = (date) => {
    if (!date) return "--:--";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      present: "bg-green-100 text-green-800",
      absent: "bg-red-100 text-red-800",
      "half-day": "bg-yellow-100 text-yellow-800",
      late: "bg-orange-100 text-orange-800",
      "on-leave": "bg-blue-100 text-blue-800",
      holiday: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const calculateWorkingHours = () => {
    if (!todayAttendance?.punchIn?.time) return "00:00:00";

    const start = new Date(todayAttendance.punchIn.time);
    const end = todayAttendance.punchOut?.time
      ? new Date(todayAttendance.punchOut.time)
      : new Date();
    const diff = end - start;

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Attendance System
          </h1>
          <p className="text-gray-600">
            Track your daily attendance and working hours
          </p>
        </div>

        {/* Current Time Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="w-8 h-8" />
                <div className="text-5xl font-bold">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
              <div className="text-blue-100 text-lg">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
            {location && (
              <div className="text-right">
                <MapPin className="w-6 h-6 mb-2 ml-auto" />
                <p className="text-blue-100 text-sm">Location Enabled</p>
                <p className="text-xs text-blue-200">
                  {location.latitude.toFixed(4)},{" "}
                  {location.longitude.toFixed(4)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Punch Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Today's Attendance
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Punch In</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatTime(todayAttendance?.punchIn?.time)}
                  </p>
                  {todayAttendance?.isLate && (
                    <span className="inline-flex items-center text-xs text-orange-600 mt-1">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Late by {todayAttendance.lateBy} mins
                    </span>
                  )}
                </div>
                <LogIn className="w-8 h-8 text-green-600" />
              </div>

              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Punch Out</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatTime(todayAttendance?.punchOut?.time)}
                  </p>
                </div>
                <LogOut className="w-8 h-8 text-red-600" />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Working Hours</p>
                <p className="text-3xl font-bold text-blue-600">
                  {todayAttendance?.workingHours?.toFixed(2) ||
                    calculateWorkingHours()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePunchIn}
                  disabled={isPunchingIn || todayAttendance?.punchIn?.time}
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                    todayAttendance?.punchIn?.time
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  <LogIn className="w-5 h-5" />
                  <span>{isPunchingIn ? "Punching..." : "Punch In"}</span>
                </button>

                <button
                  onClick={handlePunchOut}
                  disabled={
                    isPunchingOut ||
                    !todayAttendance?.punchIn?.time ||
                    todayAttendance?.punchOut?.time
                  }
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                    !todayAttendance?.punchIn?.time ||
                    todayAttendance?.punchOut?.time
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  <LogOut className="w-5 h-5" />
                  <span>{isPunchingOut ? "Punching..." : "Punch Out"}</span>
                </button>
              </div>

              {/* Break Button */}
              {todayAttendance?.punchIn?.time &&
                !todayAttendance?.punchOut?.time && (
                  <button
                    onClick={isBreakActive ? handleEndBreak : handleStartBreak}
                    className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                      isBreakActive
                        ? "bg-orange-600 text-white hover:bg-orange-700"
                        : "bg-yellow-600 text-white hover:bg-yellow-700"
                    }`}
                  >
                    <Coffee className="w-5 h-5" />
                    <span>{isBreakActive ? "End Break" : "Start Break"}</span>
                  </button>
                )}
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Today's Status
            </h3>

            {todayAttendance ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(todayAttendance.status)}`}
                  >
                    {todayAttendance.status}
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Shift</p>
                  <p className="font-semibold text-gray-900">
                    {todayAttendance.shift?.name || "No Shift"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {todayAttendance.shift?.startTime} -{" "}
                    {todayAttendance.shift?.endTime}
                  </p>
                </div>

                {todayAttendance.breaks &&
                  todayAttendance.breaks.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Breaks Taken</p>
                      <div className="space-y-2">
                        {todayAttendance.breaks.map((breakItem, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-700 capitalize">
                              {breakItem.type}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {breakItem.duration
                                ? `${breakItem.duration} mins`
                                : "Ongoing"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {todayAttendance.overtimeHours > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 mb-1">
                      Overtime Hours
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {todayAttendance.overtimeHours.toFixed(2)} hrs
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No attendance record for today</p>
                <p className="text-sm text-gray-400 mt-2">
                  Punch in to start tracking
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("today")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "today"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Today's Details
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "history"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "stats"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Statistics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "today" && todayAttendance && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Working Hours</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {todayAttendance.workingHours?.toFixed(2) || "0.00"} hrs
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(todayAttendance.status)}`}
                    >
                      {todayAttendance.status}
                    </span>
                  </div>
                </div>

                {todayAttendance.punchIn?.location && (
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Punch In Location
                    </p>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm">
                          {todayAttendance.punchIn.location.address ||
                            "Location captured"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {todayAttendance.punchIn.device?.os} -{" "}
                          {todayAttendance.punchIn.device?.browser}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div>
                {/* Filters */}
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) =>
                        setFilters({ ...filters, startDate: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) =>
                        setFilters({ ...filters, endDate: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={exportAttendance}
                    className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>

                {/* History List */}
                <div className="space-y-3">
                  {history.map((record, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatDate(record.date)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {record.shift?.name}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}
                        >
                          {record.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">In</p>
                          <p className="font-medium">
                            {formatTime(record.punchIn?.time)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Out</p>
                          <p className="font-medium">
                            {formatTime(record.punchOut?.time)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Hours</p>
                          <p className="font-medium">
                            {record.workingHours?.toFixed(2)} hrs
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "stats" && stats && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Total Days</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.totalDays}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.present}
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-sm text-gray-600">Absent</p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.absent}
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <AlertCircle className="w-8 h-8 text-yellow-600" />
                  </div>
                  <p className="text-sm text-gray-600">Half Day</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.halfDay}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Briefcase className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">Total Hours</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.totalWorkingHours}
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-sm text-gray-600">Overtime</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {stats.totalOvertimeHours}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PunchInOut;
