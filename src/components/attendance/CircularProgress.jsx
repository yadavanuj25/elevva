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

  const progress = calculateProgress();
  const radius = 70;
  const strokeWidth = 10;
  const size = 160;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Gray background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Green progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#22c55e"
          strokeWidth={strokeWidth}
          fill="none"
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
        <p className="text-xs text-gray-500">Total Hours</p>
        <p className="text-lg font-semibold ">{formatDisplayTime()}</p>
        <p className="text-sm font-medium text-green-600">
          {progress.toFixed(0)}%
        </p>
      </div>
    </div>
  );
};

export default CircularProgress;
