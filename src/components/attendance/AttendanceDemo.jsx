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
import { IoFingerPrint } from "react-icons/io5";
import {
  endBreak,
  getAttendanceHistory,
  getTodayAttendance,
  punchIn,
  punchOut,
  startBreak,
} from "../../services/attendanceServices";
import CircularProgress from "./CircularProgress";
import AttendanceStats from "./AttendanceStats";
import StatCard from "./StatCard";

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
  const [address, setAddress] = useState("");
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
    if (location?.latitude && location?.longitude) {
      getAddressFromCoords(location.latitude, location.longitude).then(
        setAddress,
      );
    }
  }, [location]);

  useEffect(() => {
    fetchTodayAttendance();
    getLocation();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeTab === "history" || activeTab === "stats") {
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
    if (!date) return "00 : 00";
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

  const formatHoursToHM = (hours) => {
    if (hours === null || hours === undefined) return "0h 0m";
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  };
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await res.json();
      return data.display_name;
    } catch (err) {
      console.error("Failed to fetch address", err);
      return "";
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Premium Header Card with Location & Time */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl">
          <div className="flex flex-col gap-4 p-6 text-white md:flex-row md:items-center md:justify-between">
            {/* Location */}
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                <MapPin className="h-5 w-5" />
              </div>
              {location ? (
                <div className="flex items-center gap-2">
                  <p
                    className="max-w-xs truncate text-sm font-medium"
                    title={address}
                  >
                    {address || "Detecting location..."}
                  </p>
                </div>
              ) : (
                <p className="text-sm font-medium">Location unavailable</p>
              )}
            </div>

            {/* Date & Time */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
                <div className="font-mono text-lg font-bold">
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
        </div>

        {/* Main Content Grid */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
          {/* Left Column - Punch Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                Today's Attendance
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Track your work hours
              </p>
            </div>

            {/* Circular Progress */}
            <div className="mb-6 p-4">
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

            {/* Punch In Info */}
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
              <div className="rounded-lg bg-blue-600 p-2">
                <IoFingerPrint className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="mb-1 text-xs font-medium text-gray-500">
                  Punch In Time
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatTime(todayAttendance?.punchIn?.time)}
                </p>
                {todayAttendance?.isLate && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
                    <AlertCircle className="h-3 w-3" />
                    Late by {todayAttendance.lateBy} mins
                  </div>
                )}
              </div>
            </div>

            {/* Active Break Display */}
            {isBreakActive && (
              <div className="mb-4 overflow-hidden rounded-xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-yellow-700">
                      Break Time
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500"></div>
                      <span className="text-sm font-medium capitalize text-yellow-800">
                        {activeBreak?.type} Break
                      </span>
                    </div>
                  </div>
                  <p className="font-mono text-2xl font-bold text-yellow-600">
                    {breakTime}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePunchIn}
                  disabled={isPunchingIn || todayAttendance?.punchIn?.time}
                  className={`group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3.5 font-semibold shadow-lg transition-all duration-300 ${
                    todayAttendance?.punchIn?.time
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-green-500/50 hover:-translate-y-0.5"
                  }`}
                >
                  <LogIn className="h-5 w-5" />
                  <span>{isPunchingIn ? "Punching..." : "Punch In"}</span>
                </button>

                <button
                  onClick={handleShowPunchOutModal}
                  disabled={
                    isPunchingOut ||
                    !todayAttendance?.punchIn?.time ||
                    todayAttendance?.punchOut?.time
                  }
                  className={`group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3.5 font-semibold shadow-lg transition-all duration-300 ${
                    !todayAttendance?.punchIn?.time ||
                    todayAttendance?.punchOut?.time
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-red-500/50 hover:-translate-y-0.5"
                  }`}
                >
                  <LogOut className="h-5 w-5" />
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
                    className={`group relative w-full overflow-hidden rounded-xl px-4 py-3.5 font-semibold shadow-lg transition-all duration-300 ${
                      isBreakActive
                        ? "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-orange-500/50"
                        : "bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-yellow-500/50"
                    } hover:-translate-y-0.5`}
                  >
                    <div className="relative flex items-center justify-center gap-2">
                      <Coffee className="h-5 w-5" />
                      <span>{isBreakActive ? "End Break" : "Start Break"}</span>
                    </div>
                  </button>
                )}
            </div>
          </div>

          {/* Right Column - Status & Stats */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <AttendanceStats />

            {/* Today's Status Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Today's Status
              </h3>

              {todayAttendance ? (
                <div className="space-y-4">
                  {/* Status and Shift Info */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                      <p className="mb-2 text-xs font-medium text-gray-500">
                        Status
                      </p>
                      <span
                        className={`inline-block rounded-lg px-3 py-1.5 text-sm font-semibold capitalize ${getStatusColor(
                          todayAttendance.status,
                        )}`}
                      >
                        {todayAttendance.status}
                      </span>
                    </div>

                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                      <p className="mb-2 text-xs font-medium text-gray-500">
                        Shift
                      </p>
                      <p className="font-bold text-gray-900">
                        {todayAttendance.shift?.name || "No Shift"}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {todayAttendance.shift?.startTime} -{" "}
                        {todayAttendance.shift?.endTime}
                      </p>
                    </div>
                  </div>

                  {/* Breaks Taken */}
                  {todayAttendance.breaks &&
                    todayAttendance.breaks.length > 0 && (
                      <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 p-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Breaks Taken
                        </p>
                        <div className="space-y-2">
                          {todayAttendance.breaks.map((breakItem, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm"
                            >
                              <span className="text-sm font-medium capitalize text-gray-700">
                                {breakItem.type}
                              </span>
                              <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-bold text-yellow-700">
                                {breakItem.duration
                                  ? `${breakItem.duration} mins`
                                  : "Ongoing"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Overtime */}
                  {todayAttendance.overtimeHours > 0 && (
                    <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                        Overtime Hours
                      </p>
                      <p className="font-mono text-3xl font-bold text-green-600">
                        {todayAttendance.overtimeHours.toFixed(2)} hrs
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <Calendar className="h-10 w-10 text-gray-300" />
                  </div>
                  <p className="text-gray-500">
                    No attendance record for today
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    Punch in to start tracking
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("today")}
                className={`relative px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === "today"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Today's Details
                {activeTab === "today" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`relative px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === "history"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                History
                {activeTab === "history" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`relative px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === "stats"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Statistics
                {activeTab === "stats" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Today Tab */}
            {activeTab === "today" && todayAttendance && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
                    <p className="mb-2 text-sm font-medium text-gray-600">
                      Working Hours
                    </p>
                    <p className="font-mono text-4xl font-bold text-blue-600">
                      {formatHoursToHM(todayAttendance?.workingHours)}
                    </p>
                  </div>
                  <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
                    <p className="mb-2 text-sm font-medium text-gray-600">
                      Status
                    </p>
                    <span
                      className={`inline-block rounded-lg px-4 py-2 text-base font-semibold capitalize ${getStatusColor(
                        todayAttendance.status,
                      )}`}
                    >
                      {todayAttendance.status}
                    </span>
                  </div>
                </div>

                {todayAttendance.punchIn?.location && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <p className="mb-3 text-sm font-semibold text-gray-600">
                      Punch In Location
                    </p>
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-blue-600 p-2">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {todayAttendance.punchIn.location.address ||
                            "Location captured"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {todayAttendance.punchIn.device?.os} -{" "}
                          {todayAttendance.punchIn.device?.browser}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div>
                {/* Filters */}
                <div className="mb-6 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) =>
                        setFilters({ ...filters, startDate: e.target.value })
                      }
                      className="rounded-lg border-0 bg-transparent px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) =>
                        setFilters({ ...filters, endDate: e.target.value })
                      }
                      className="rounded-lg border-0 bg-transparent px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={exportAttendance}
                    className="ml-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all hover:shadow-indigo-500/50 hover:-translate-y-0.5"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>

                {/* History List */}
                <div className="space-y-3">
                  {history.map((record, index) => (
                    <div
                      key={index}
                      className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-5">
                        <div>
                          <p className="mb-1 font-bold text-gray-900">
                            {formatDate(record.date)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {record.shift?.name}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 text-xs text-gray-500">Punch In</p>
                          <p className="font-mono font-semibold text-gray-900">
                            {formatTime(record.punchIn?.time)}
                          </p>
                        </div>

                        <div className="flex items-center justify-center">
                          <span
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${getStatusColor(
                              record.status,
                            )}`}
                          >
                            {record.status}
                          </span>
                        </div>

                        <div>
                          <p className="mb-1 text-xs text-gray-500">
                            Punch Out
                          </p>
                          <p className="font-mono font-semibold text-gray-900">
                            {formatTime(record.punchOut?.time)}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 text-xs text-gray-500">
                            Total Hours
                          </p>
                          <p className="font-mono font-semibold text-gray-900">
                            {formatHoursToHM(record.workingHours)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === "stats" && stats && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Premium Stat Cards */}
                <PremiumStatCard
                  icon={Calendar}
                  label="Total Days"
                  value={stats.totalDays}
                  gradient="from-blue-500 to-indigo-600"
                  bgGradient="from-blue-50 to-indigo-50"
                  iconBg="bg-blue-600"
                />
                <PremiumStatCard
                  icon={CheckCircle}
                  label="Present"
                  value={stats.present}
                  gradient="from-green-500 to-emerald-600"
                  bgGradient="from-green-50 to-emerald-50"
                  iconBg="bg-green-600"
                  percentage={
                    stats.totalDays > 0
                      ? (stats.present / stats.totalDays) * 100
                      : 0
                  }
                />
                <PremiumStatCard
                  icon={XCircle}
                  label="Absent"
                  value={stats.absent}
                  gradient="from-red-500 to-rose-600"
                  bgGradient="from-red-50 to-rose-50"
                  iconBg="bg-red-600"
                  percentage={
                    stats.totalDays > 0
                      ? (stats.absent / stats.totalDays) * 100
                      : 0
                  }
                />
                <PremiumStatCard
                  icon={AlertCircle}
                  label="Half Day"
                  value={stats.halfDay}
                  gradient="from-yellow-500 to-amber-600"
                  bgGradient="from-yellow-50 to-amber-50"
                  iconBg="bg-yellow-600"
                />
                <PremiumStatCard
                  icon={Briefcase}
                  label="Total Hours"
                  value={stats.totalWorkingHours}
                  gradient="from-purple-500 to-violet-600"
                  bgGradient="from-purple-50 to-violet-50"
                  iconBg="bg-purple-600"
                  suffix="hrs"
                />
                <PremiumStatCard
                  icon={TrendingUp}
                  label="Overtime"
                  value={stats.totalOvertimeHours}
                  gradient="from-indigo-500 to-blue-600"
                  bgGradient="from-indigo-50 to-blue-50"
                  iconBg="bg-indigo-600"
                  suffix="hrs"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Break Modal */}
      {showBreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl animate-scaleIn rounded-2xl bg-white p-8 shadow-2xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Select Break Type
            </h2>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {Object.entries(breakTypes).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleSelectBreakType(value.name)}
                  className={`group relative overflow-hidden rounded-xl border-2 p-5 transition-all ${
                    selectedBreakType === key
                      ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/30"
                      : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="mb-4 flex justify-center">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl text-white shadow-lg ${
                        selectedBreakType === key
                          ? "scale-110"
                          : "group-hover:scale-105"
                      } transition-transform`}
                    >
                      {value.icon}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-1 font-bold text-gray-900">
                      {value.name}
                    </div>
                    <div className="text-xs text-gray-500">{value.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleStartBreak}
                disabled={!selectedBreakType}
                className={`flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 font-semibold shadow-lg transition-all ${
                  selectedBreakType
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-green-500/50 hover:-translate-y-0.5"
                    : "cursor-not-allowed bg-gray-200 text-gray-400"
                }`}
              >
                <Coffee className="h-5 w-5" />
                Start Break
              </button>
              <button
                onClick={() => {
                  setShowBreakModal(false);
                  setSelectedBreakType(null);
                }}
                className="w-full rounded-xl bg-gray-100 px-6 py-4 font-semibold text-gray-700 transition-all hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Punch Out Modal */}
      {showPunchOutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-scaleIn rounded-2xl bg-white p-8 shadow-2xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Confirm Punch Out
            </h2>

            {/* Summary Card */}
            <div className="mb-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
                Today's Summary
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border-2 border-white bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm">
                  <div className="mb-1 text-xs text-gray-500">Total Work</div>
                  <div className="font-mono text-xl font-bold text-gray-900">
                    {workingTime}
                  </div>
                </div>
                <div className="rounded-lg border-2 border-white bg-gradient-to-br from-yellow-50 to-amber-50 p-4 shadow-sm">
                  <div className="mb-1 text-xs text-gray-500">Total Breaks</div>
                  <div className="font-mono text-xl font-bold text-gray-900">
                    {formatTimeFromMs(getTotalBreakTime())}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="mb-6 rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
                <MapPin className="h-4 w-4" />
                Punch Out Location
              </div>
              <div className="font-mono text-sm text-gray-900">
                {location
                  ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                  : "Detecting location..."}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePunchOut}
                disabled={isPunchingOut}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-red-500/50 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut className="h-5 w-5" />
                {isPunchingOut ? "Punching Out..." : "Confirm Punch Out"}
              </button>
              <button
                onClick={() => setShowPunchOutModal(false)}
                className="w-full rounded-xl bg-gray-100 px-6 py-4 font-semibold text-gray-700 transition-all hover:bg-gray-200"
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

// Premium Stat Card Component
function PremiumStatCard({
  icon: Icon,
  label,
  value,
  gradient,
  bgGradient,
  iconBg,
  percentage,
  suffix,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Background Decoration */}
      <div
        className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 transition-transform duration-300 group-hover:scale-110`}
      ></div>

      <div className="relative">
        {/* Icon and Badge Row */}
        <div className="mb-4 flex items-center justify-between">
          <div className={`rounded-xl ${iconBg} p-3 shadow-md`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          {percentage !== undefined && (
            <div
              className={`rounded-full bg-gradient-to-r ${gradient} px-3 py-1 opacity-20`}
            >
              <span className="text-xs font-bold text-gray-900">
                {Math.round(percentage)}%
              </span>
            </div>
          )}
        </div>

        {/* Label */}
        <p className="mb-2 text-sm font-semibold text-gray-600">{label}</p>

        {/* Value */}
        <p
          className={`mb-3 bg-gradient-to-r ${gradient} bg-clip-text text-4xl font-bold text-transparent`}
        >
          {value} {suffix && <span className="text-2xl">{suffix}</span>}
        </p>

        {/* Progress Bar */}
        {percentage !== undefined && (
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceTracker;
