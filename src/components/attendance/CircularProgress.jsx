import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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

    let shiftDuration = shiftEnd - shiftStart;
    if (shiftDuration < 0) shiftDuration += 24;

    let currentHours = 0;
    if (isPunchedIn && workingTime) {
      const [h, m, s] = workingTime.split(":").map(Number);
      currentHours = h + m / 60 + s / 3600;
    } else if (workingHours) {
      currentHours = workingHours;
    }

    return Math.min((currentHours / shiftDuration) * 100, 100);
  };

  const formatDisplayTime = () => {
    if (isPunchedIn && workingTime) return workingTime;
    if (workingHours) {
      const h = Math.floor(workingHours);
      const m = Math.floor((workingHours % 1) * 60);
      return `${h}:${m.toString().padStart(2, "0")}:00`;
    }
    return "0:00:00";
  };

  const displayTime = formatDisplayTime();
  const [hours = "00", minutes = "00", seconds = "00"] = displayTime.split(":");

  const progress = calculateProgress();
  const radius = 75;
  const strokeWidth = 12;
  const outerRadius = radius + 16;
  const outerStrokeWidth = 4.5;

  const size = 200;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Get status color based on progress
  const getStatusColor = () => {
    if (progress >= 76)
      return { main: "#16a34a", light: "#4ade80", dark: "#065f46" };

    if (progress >= 51)
      return { main: "#2563eb", light: "#93c5fd", dark: "#1e40af" };

    if (progress >= 26)
      return { main: "#f59e0b", light: "#fde68a", dark: "#b45309" };

    return { main: "#ef4444", light: "#fca5a5", dark: "#b91c1c" };
  };

  const statusColor = getStatusColor();

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Gradient Definitions */}
        <defs>
          {/* Progress gradient */}
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={statusColor.light} />
            <stop offset="100%" stopColor={statusColor.main} />
          </linearGradient>
        </defs>

        {/* Outer border circle - clean single stroke */}

        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          stroke="#e5e7eb"
          strokeWidth={outerStrokeWidth}
          fill="none"
          className="dark:stroke-gray-700 drop-shadow-md"
        />

        {/* Background track - solid clean color */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
          fill="none"
          className="dark:stroke-gray-500"
        />

        {/* Animated progress circle with gradient */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </svg>

      {/* Center content - clean and minimal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Label */}
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase mb-1">
          Total Hours
        </p>

        {/* Time display */}

        <div className="rounded-lg px-4 py-1 ">
          <div className="flex text-lg font-bold items-center gap-1 ">
            <span>{hours}:</span>
            <span>{minutes}:</span>
            {/* Animated Seconds */}
            <div className="relative h-[1.5em] w-[2ch] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={seconds}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute left-0"
                >
                  {seconds}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-1 px-2 py-0 rounded-full backdrop-blur-sm transition-all duration-500"
          style={{
            backgroundColor: statusColor.main,
            boxShadow: `0 2px 8px ${statusColor.glow}, 0 0 0 1px ${statusColor.light}20`,
          }}
        >
          <p className="text-[11px] font-bold text-white tracking-tight tabular-nums">
            {progress.toFixed(0)}%
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CircularProgress;
