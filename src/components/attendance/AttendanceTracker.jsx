import React, { useState, useEffect } from "react";

import {
  swalSuccess,
  swalError,
  swalWarning,
  swalInfo,
} from "../../utils/swalHelper";

import {
  endBreak,
  getAttendanceHistory,
  getTodayAttendance,
  punchIn,
  punchOut,
  startBreak,
} from "../../services/attendanceServices";
import AttendanceStats from "./AttendanceStats";
import CustomSwal from "../../utils/CustomSwal";
import { useAuth } from "../../auth/AuthContext";
import AttendanceHistoryTable from "./AttendanceTable";
import LocationHeader from "./LocationHeader";
import PunchOutModal from "../modals/attendanceModal/PunchOutModal";
import PunchInModal from "../modals/attendanceModal/PunchInModal";
import EmptyState from "./EmptyState";
import TabNavigation from "./TabNavigation";
import BreakTypeModal from "../modals/attendanceModal/BreakTypeModal";
import AttendanceCard from "./cards/AttendanceCard";
import StatsGrid from "./cards/StatsGrid";

const AttendanceTracker = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [isPunchingIn, setIsPunchingIn] = useState(false);
  const [isPunchingOut, setIsPunchingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("stats");
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeBreak, setActiveBreak] = useState(null);
  const [isBreakActive, setIsBreakActive] = useState(false);

  const [formData, setFormData] = useState({
    workMode: "office",
    notes: "",
  });

  // New states for break modal and timers
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showPunchOutModal, setShowPunchOutModal] = useState(false);
  const [showPunchInModal, setShowPunchInModal] = useState(false);
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
  // const [filters, setFilters] = useState({
  //   startDate: null,
  //   endDate: null,
  //   page: 1,
  //   limit: 30,
  // });

  useEffect(() => {
    document.title = "Elevva | Attendance";
  }, []);

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
  }, [isPunchingIn]);

  useEffect(() => {
    if (activeTab === "history" || activeTab === "stats") {
      fetchHistory();
    }
  }, []);

  // useEffect(() => {
  //   fetchHistory();
  // }, []);

  // Update working time counter
  useEffect(() => {
    let interval;
    if (todayAttendance?.punchIn?.time && !todayAttendance?.punchOut?.time) {
      interval = setInterval(() => {
        const elapsed = calculateElapsedWorkTime();
        if (elapsed > 0) {
          setWorkingTime(formatTimeFromMs(elapsed));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [todayAttendance, isBreakActive, activeBreak]);

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

  const timeParts = currentTime
    .toLocaleTimeString("en-US", {
      timeZone: user?.shift?.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .split(":");

  const seconds = timeParts[2].slice(0, 2);
  const ampm = timeParts[2].slice(3);

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
      const data = await res.data;
      const statsData = await res.stats;
      setHistory(data || []);
      setStats(statsData || null);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // const fetchHistory = async () => {
  //   try {
  //     const params = {
  //       page: filters.page,
  //       limit: filters.limit,
  //       ...(filters.startDate && { startDate: filters.startDate }),
  //       ...(filters.endDate && { endDate: filters.endDate }),
  //     };

  //     const res = await getAttendanceHistory(params);

  //     const data = res.data;
  //     const statsData = res.stats;

  //     setHistory(data || []);
  //     setStats(statsData || null);
  //   } catch (error) {
  //     console.error("Error fetching history:", error);
  //   }
  // };

  const handleWorkModeToggle = (mode) => {
    setFormData((p) => ({ ...p, workMode: mode }));
  };
  const handleNoteChange = (e) => {
    setFormData((p) => ({ ...p, notes: e.target.value }));
  };

  const handlePunchIn = async () => {
    if (!location) {
      swalWarning("Location Required", "Please enable location access");
      return;
    }
    if (!formData.workMode) {
      return;
    }
    setIsPunchingIn(true);
    try {
      const payload = {
        latitude: location.latitude,
        longitude: location.longitude,
        workMode: formData.workMode,
        notes: formData.notes,
      };
      const data = await punchIn(payload);

      if (data.success) {
        setTodayAttendance(data.data);
        setShowPunchInModal(false);
        swalSuccess("Punch In Successful", data.message);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      swalError(
        error || "Punch In Failed",
        "Something went wrong. Please try again.",
      );
    }
    setIsPunchingIn(false);
  };

  const handlePunchOut = async () => {
    if (!location) {
      swalWarning("Location Required", "Please enable location access");
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
        CustomSwal.fire({
          icon: "success",
          title: "Punch Out Successful",
          html: `
    
    <hr />
    <p><b>Working Hours:</b> ${response.summary.workingHours} hrs</p>
    <p><b>Overtime:</b> ${response.summary.overtimeHours} hrs</p>
  `,
          confirmButtonText: "Done",
        });
      } else {
        console.log(response.message);
      }
    } catch (error) {
      swalWarning("Ongoing Break...", error.message);
    }
    setIsPunchingOut(false);
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
        swalSuccess("Break Started");
      } else {
        console.log(response.message);
      }
    } catch (error) {
      swalError("Failed to start break", error);
    }
  };

  const handleEndBreak = async () => {
    try {
      const response = await endBreak();
      if (response.success) {
        setIsBreakActive(false);
        fetchTodayAttendance();
        swalInfo("Break Ended", response.message);
      } else {
        console.log(response.message);
      }
    } catch (error) {
      swalError("Failed to end break", error);
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
      swalError("Export Failed", error);
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
  const formatMinutesToHours = (minutes) => {
    if (!minutes || minutes <= 0) return "0 min";

    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h`;
    return `${mins}m`;
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
    if (isBreakActive && activeBreak?.breakStart) {
      totalBreakTime += new Date() - new Date(activeBreak.breakStart);
    }

    return totalBreakTime;
  };

  return (
    <>
      {/* 1. LOCATION HEADER - Shows location and time */}
      <LocationHeader
        location={location}
        address={address}
        currentTime={currentTime}
        timeParts={timeParts}
        seconds={seconds}
        ampm={ampm}
        timezone={user?.shift?.timezone}
      />

      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,40%)_minmax(0,70%)] gap-6 mb-6">
          {/* 2. ATTENDANCE CARD - Main punch in/out card */}
          <AttendanceCard
            todayAttendance={todayAttendance}
            workingTime={workingTime}
            isBreakActive={isBreakActive}
            activeBreak={activeBreak}
            breakTime={breakTime}
            isPunchingIn={isPunchingIn}
            isPunchingOut={isPunchingOut}
            onPunchIn={() => setShowPunchInModal(true)}
            onPunchOut={() => setShowPunchOutModal(true)}
            onStartBreak={() => setShowBreakModal(true)}
            onEndBreak={handleEndBreak}
            formatTime={formatTime}
            formatMinutesToHours={formatMinutesToHours}
          />

          {/* 3. ATTENDANCE STATS OR EMPTY STATE */}
          {/* 3. ATTENDANCE STATS OR EMPTY STATE */}
          <div className="space-y-4 h-full">
            {todayAttendance ? (
              <AttendanceStats attendance={todayAttendance} />
            ) : (
              <EmptyState
                title="No attendance record for today"
                description="You haven’t punched in today."
              />
            )}
          </div>
        </div>

        {/* 4. TABS SECTION */}
        <div className="border border-gray-300 dark:border-gray-600 rounded-xl">
          {/* TAB NAVIGATION */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* TAB CONTENT */}
          <div className="p-4">
            {/* HISTORY TAB */}
            {activeTab === "history" &&
              (history && history.length > 0 ? (
                <AttendanceHistoryTable
                  history={history}
                  exportAttendance={exportAttendance}
                />
              ) : (
                <EmptyState
                  title="No attendance history found"
                  description="There are no records for the selected period."
                />
              ))}

            {/* STATS TAB */}
            {activeTab === "stats" &&
              (stats ? (
                <StatsGrid stats={stats} />
              ) : (
                <EmptyState
                  title="No statistics available"
                  description="Statistics will appear once attendance data exists."
                />
              ))}
          </div>
        </div>
      </div>

      {/* 5. BREAK TYPE MODAL - Select break type */}
      <BreakTypeModal
        isOpen={showBreakModal}
        onClose={() => {
          setShowBreakModal(false);
          setSelectedBreakType(null);
        }}
        selectedBreakType={selectedBreakType}
        onSelectBreakType={setSelectedBreakType}
        onStartBreak={handleStartBreak}
      />

      {/* 6. PUNCH IN MODAL - Confirm punch in */}
      <PunchInModal
        isOpen={showPunchInModal}
        onClose={() => setShowPunchInModal(false)}
        formData={formData}
        onWorkModeToggle={handleWorkModeToggle}
        onNoteChange={handleNoteChange}
        location={location}
        isPunchingIn={isPunchingIn}
        onConfirm={handlePunchIn}
      />

      {/* 7. PUNCH OUT MODAL - Confirm punch out */}
      <PunchOutModal
        isOpen={showPunchOutModal}
        onClose={() => setShowPunchOutModal(false)}
        workingTime={workingTime}
        totalBreakTime={getTotalBreakTime()}
        location={location}
        isPunchingOut={isPunchingOut}
        onConfirm={handlePunchOut}
        formatTimeFromMs={formatTimeFromMs}
      />
    </>
  );
};

export default AttendanceTracker;
