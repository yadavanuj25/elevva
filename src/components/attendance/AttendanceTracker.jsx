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
import WorkingHoursCircle from "./WorkingHoursCircle";

const CircularProgress = ({
  workingTime,
  shiftStartTime,
  shiftEndTime,
  isPunchedIn,
  workingHours,
}) => {
  const calculateProgress = () => {
    if (!shiftStartTime || !shiftEndTime) return 0;
    const parseTime = (timeStr) => {
      if (!timeStr) return 0;
      if (!timeStr.includes("AM") && !timeStr.includes("PM")) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours + minutes / 60;
      }
      const [time, period] = timeStr.split(" ");
      const [hours, minutes] = time.split(":").map(Number);
      let totalHours = hours;

      if (period === "PM" && hours !== 12) totalHours += 12;
      if (period === "AM" && hours === 12) totalHours = 0;

      return totalHours + minutes / 60;
    };

    const shiftStart = parseTime(shiftStartTime);
    const shiftEnd = parseTime(shiftEndTime);

    // Calculate total shift duration
    let shiftDuration = shiftEnd - shiftStart;
    if (shiftDuration < 0) shiftDuration += 24; // Handle overnight shifts

    // Get current working hours
    let currentHours = 0;
    if (isPunchedIn && workingTime) {
      const [hours, minutes, seconds] = workingTime.split(":").map(Number);
      currentHours = hours + minutes / 60 + seconds / 3600;
    } else if (workingHours) {
      currentHours = workingHours;
    }

    // Calculate percentage (max 100%)
    const percentage = Math.min((currentHours / shiftDuration) * 100, 100);
    return percentage;
  };

  const formatDisplayTime = () => {
    if (isPunchedIn && workingTime) {
      return workingTime;
    } else if (workingHours) {
      const hours = Math.floor(workingHours);
      const minutes = Math.floor((workingHours % 1) * 60);
      return `${hours}:${minutes.toString().padStart(2, "0")}:00`;
    }
    return "0:00:00";
  };

  const progress = calculateProgress();
  const circumference = 2 * Math.PI * 70; // radius = 70
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width="160" height="160">
        {/* Background circle */}
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="gray"
          strokeWidth="15"
          fill="#fff"
        />
        {/* Progress circle */}
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="green"
          strokeWidth="8"
          fill="#fff"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.5s ease",
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className=" text-gray-500 mb-1">Total Hours</p>
        <p className="font-bold text-black ">{formatDisplayTime()}</p>
        <p className="text-xs text-green-600 font-medium mt-1">
          {progress.toFixed(0)}%
        </p>
      </div>
    </div>
  );
};

const AttendanceTracker = () => {
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

  // New states for break modal and timers
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showPunchOutModal, setShowPunchOutModal] = useState(false);
  const [selectedBreakType, setSelectedBreakType] = useState(null);
  const [workingTime, setWorkingTime] = useState("00:00:00");
  const [breakTime, setBreakTime] = useState("00:00:00");

  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    page: 1,
    limit: 30,
  });

  // Break types configuration

  const breakTypes = {
    lunch: { name: "Lunch-Break", desc: "Meal time break", icon: "🍽️" },
    tea: { name: "Tea-Break", desc: "Tea time break", icon: "🍽️" },

    personal: {
      name: "Personal-Break",
      desc: "Restroom, coffee",
      icon: "👤",
    },
  };

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

  // Update working time counter
  useEffect(() => {
    let interval;
    if (
      todayAttendance?.punchIn?.time &&
      !todayAttendance?.punchOut?.time &&
      !isBreakActive
    ) {
      interval = setInterval(() => {
        const elapsed = calculateElapsedWorkTime();
        setWorkingTime(formatTimeFromMs(elapsed));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [todayAttendance, isBreakActive]);

  // Update break time counter
  useEffect(() => {
    let interval;
    if (isBreakActive && activeBreak?.breakStart) {
      interval = setInterval(() => {
        const elapsed = new Date() - new Date(activeBreak.breakStart);
        setBreakTime(formatTimeFromMs(elapsed));
      }, 1000);
    } else {
      setBreakTime("00:00:00");
    }
    return () => clearInterval(interval);
  }, [isBreakActive, activeBreak]);

  // Calculate elapsed work time excluding breaks
  const calculateElapsedWorkTime = () => {
    if (!todayAttendance?.punchIn?.time) return 0;

    const start = new Date(todayAttendance.punchIn.time);
    const end = todayAttendance.punchOut?.time
      ? new Date(todayAttendance.punchOut.time)
      : new Date();

    let totalBreakTime = 0;
    if (todayAttendance.breaks) {
      todayAttendance.breaks.forEach((b) => {
        if (b.breakEnd) {
          const breakStart = new Date(b.breakStart);
          const breakEnd = new Date(b.breakEnd);
          totalBreakTime += breakEnd - breakStart;
        }
      });
    }

    // Add current break time if active
    if (isBreakActive && activeBreak?.breakStart) {
      totalBreakTime += new Date() - new Date(activeBreak.breakStart);
    }

    return end - start - totalBreakTime;
  };

  // Format time from milliseconds
  const formatTimeFromMs = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const formatDay = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const datePart = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(d);

    const timePart = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);

    return `${datePart} at ${timePart}`;
  };

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
        setShowPunchOutModal(false);
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

  const handleShowBreakModal = () => {
    getLocation();
    setShowBreakModal(true);
  };

  const handleSelectBreakType = (type) => {
    setSelectedBreakType(type);
  };

  const handleStartBreak = async () => {
    if (!selectedBreakType) return;

    try {
      const payload = { breakType: selectedBreakType };
      const response = await startBreak(payload);

      if (response.success) {
        setIsBreakActive(true);
        setShowBreakModal(false);
        setSelectedBreakType(null);
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

  const handleShowPunchOutModal = () => {
    getLocation();
    setShowPunchOutModal(true);
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

  const formatHoursToHM = (hours) => {
    if (hours === null || hours === undefined) return "0h 0m";

    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    return `${h}h ${m}m`;
  };

  const getTotalBreakTime = () => {
    if (!todayAttendance?.breaks) return 0;

    let totalBreakTime = 0;
    todayAttendance.breaks.forEach((b) => {
      if (b.breakEnd) {
        const breakStart = new Date(b.breakStart);
        const breakEnd = new Date(b.breakEnd);
        totalBreakTime += breakEnd - breakStart;
      }
    });

    // Add current break time if active
    if (isBreakActive && activeBreak?.breakStart) {
      totalBreakTime += new Date() - new Date(activeBreak.breakStart);
    }

    return totalBreakTime;
  };

  return (
    <div className="min-h-screen">
      <div className=" mx-auto">
        <div className=" mb-2 animate-slideDown">
          <h2 className="text-2xl font-semibold  ">⏱️ Attendance Tracker</h2>
        </div>

        {/* Current Time Card */}
        <div className="flex justify-between items-center  bg-accent-dark rounded-xl shadow-lg p-4 mb-3 text-white">
          <div>
            {location && (
              <div className=" flex items-center gap-4">
                <MapPin size={20} />
                <p className="text-white-500 text-sm">Location Enabled : </p>
                <p className="text-xs text-white-500">
                  {location.latitude.toFixed(4)},{" "}
                  {location.longitude.toFixed(4)}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex  items-center gap-4  text-white-500 ">
              <Clock size={20} />
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="">
              <div className="text-medium font-bold">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,40%)_minmax(0,60%)] gap-6 mb-6">
          {/* Punch Card */}
          <div className=" bg-accent-light rounded-xl border border-accent-dark shadow-lg p-4">
            <h3 className="text-lg text-center font-semibold text-gray-900 mb-4">
              Today's Attendance
            </h3>
            <div className="space-y-4">
              <div className="p-4 text-center  rounded-lg">
                <CircularProgress
                  workingTime={workingTime}
                  shiftStartTime={todayAttendance?.shift?.startTime}
                  shiftEndTime={todayAttendance?.shift?.endTime}
                  isPunchedIn={
                    todayAttendance?.punchIn?.time &&
                    !todayAttendance?.punchOut?.time
                  }
                  workingHours={todayAttendance?.workingHours}
                />
              </div>

              <div className="flex items-stretch w-full gap-4">
                <div className="w-1/2 flex items-center gap-2 px-4 py-2  rounded-lg border bg-white">
                  <LogIn className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="  flex gap-4 items-center ">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">Punch In</p>
                        <p className=" font-bold text-gray-900">
                          {formatTime(todayAttendance?.punchIn?.time)}
                        </p>
                      </div>
                    </div>
                    {todayAttendance?.isLate && (
                      <span className="inline-flex items-center text-xs text-orange-600 mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Late by {todayAttendance.lateBy} mins
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-1/2 px-4 py-2  rounded-lg bg-white">
                  <div className=" flex gap-4 items-center ">
                    <LogOut className="w-6 h-6 text-red-600" />
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">Punch Out</p>
                      <p className=" font-bold text-gray-900">
                        {formatTime(todayAttendance?.punchOut?.time)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Break Time Display */}
              {isBreakActive && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700 mb-1">Break Time</p>
                  <p className="text-3xl font-bold text-yellow-600 font-mono">
                    {breakTime}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                    <span className="text-xs text-yellow-700 capitalize">
                      {activeBreak?.type} Break
                    </span>
                  </div>
                </div>
              )}

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
                  onClick={handleShowPunchOutModal}
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
                    onClick={
                      isBreakActive ? handleEndBreak : handleShowBreakModal
                    }
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
          <div className=" bg-white rounded-xl shadow-lg p-6">
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
                  <div className=" rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Working Hours</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatHoursToHM(todayAttendance?.workingHours)}
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
                            {formatHoursToHM(record.workingHours)}
                            {/* {record.workingHours?.toFixed(2)} hrs */}
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

      {/* Break Type Modal */}
      {showBreakModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-5 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-7 max-w-xl w-full shadow-2xl animate-scaleIn">
            <div className="text-xl font-semibold mb-5 text-gray-900">
              Select Break Type
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-3">
              {Object.entries(breakTypes).map(([key, value]) => (
                <div
                  key={key}
                  onClick={() => handleSelectBreakType(value.name)}
                  className={`cursor-pointer transition-all border-2 rounded-xl
        flex flex-col items-center justify-between p-4
        min-h-[120px]
        ${
          selectedBreakType === key
            ? "bg-blue-50 border-blue-500"
            : "bg-gray-50 border-transparent hover:bg-gray-100 hover:border-blue-300"
        }`}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-xl text-white">
                    {value.icon}
                  </div>

                  {/* Text */}
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {value.name}
                    </div>
                    <div className="text-sm text-gray-600">{value.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleStartBreak}
                disabled={!selectedBreakType}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all ${
                  selectedBreakType
                    ? "bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Coffee className="w-5 h-5" />
                Start Break
              </button>
              <button
                onClick={() => {
                  setShowBreakModal(false);
                  setSelectedBreakType(null);
                }}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Punch Out Confirmation Modal */}
      {showPunchOutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-5 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-7 max-w-md w-full shadow-2xl animate-scaleIn">
            <div className="text-xl font-semibold mb-5 text-gray-900">
              Confirm Punch Out
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h3 className="text-sm text-gray-600 mb-3">Today's Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Total Work</div>
                  <div className="text-lg font-semibold font-mono text-gray-900">
                    {workingTime}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Total Breaks</div>
                  <div className="text-lg font-semibold font-mono text-gray-900">
                    {formatTimeFromMs(getTotalBreakTime())}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <MapPin className="w-4 h-4" />
                Punch Out Location
              </div>
              <div className="text-gray-900 text-sm">
                {location
                  ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                  : "Detecting location..."}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePunchOut}
                disabled={isPunchingOut}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-5 h-5" />
                {isPunchingOut ? "Punching Out..." : "Confirm Punch Out"}
              </button>
              <button
                onClick={() => setShowPunchOutModal(false)}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;
