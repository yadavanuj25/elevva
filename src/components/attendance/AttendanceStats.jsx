import React, { useMemo } from "react";
import StatCard from "./StatCard";
import {
  BedDouble,
  Calendar,
  Coffee,
  MapPin,
  Soup,
  UsbIcon,
  Utensils,
} from "lucide-react";

const AttendanceStats = ({ attendance }) => {
  const minutesToHM = (mins) => {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${h > 0 ? `${h}h ` : ""}${m}m`;
  };

  const hoursToHM = (hours) => {
    const totalMins = Math.round(hours * 60);
    return minutesToHM(totalMins);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const stats = useMemo(() => {
    if (!attendance) return null;
    const productiveHours = attendance.workingHours || 0;
    // Fixed: Use overtimeHours directly from attendance without lateBy calculation
    const overtimeHours = attendance?.overtimeHours || 0;
    const breakMinutes = attendance.breaks?.reduce(
      (sum, b) => sum + (b.duration || 0),
      0,
    );
    const totalHours = productiveHours + overtimeHours + breakMinutes / 60;
    const shiftHours = attendance.shift?.fullDayHours || 8;

    return {
      productiveHours,
      overtimeHours,
      breakMinutes,
      totalHours,
      shiftHours,
    };
  }, [attendance]);

  // Build timeline segments with actual times and categorize by type
  const timelineSegments = useMemo(() => {
    if (!attendance?.punchIn?.time) return [];
    const segments = [];
    const punchInTime = new Date(attendance.punchIn.time);
    let currentTime = new Date(punchInTime);

    // Get shift duration in hours
    const shiftDurationHours = attendance.shift?.fullDayHours || 8;

    // If no breaks, calculate work segments
    if (!attendance.breaks || attendance.breaks.length === 0) {
      const endTime = attendance.punchOut?.time
        ? new Date(attendance.punchOut.time)
        : new Date();
      const totalMinutes = (endTime - punchInTime) / (1000 * 60);
      const shiftMinutes = shiftDurationHours * 60;

      // Check if there's overtime
      if (totalMinutes > shiftMinutes) {
        const regularEndTime = new Date(
          punchInTime.getTime() + shiftMinutes * 60 * 1000,
        );
        segments.push({
          type: "work",
          startTime: punchInTime,
          endTime: regularEndTime,
          duration: shiftMinutes,
        });

        // Overtime
        segments.push({
          type: "overtime",
          startTime: regularEndTime,
          endTime: endTime,
          duration: totalMinutes - shiftMinutes,
          isOngoing: !attendance.punchOut?.time,
        });
      } else {
        // Just regular work
        segments.push({
          type: "work",
          startTime: punchInTime,
          endTime: endTime,
          duration: totalMinutes,
          isOngoing: !attendance.punchOut?.time,
        });
      }

      return segments;
    }
    const sortedBreaks = [...attendance.breaks].sort(
      (a, b) => new Date(a.breakStart) - new Date(b.breakStart),
    );
    const endTime = attendance.punchOut?.time
      ? new Date(attendance.punchOut.time)
      : new Date();
    const totalElapsed = (endTime - punchInTime) / (1000 * 60);
    const totalBreakMinutes = sortedBreaks.reduce((sum, b) => {
      const start = new Date(b.breakStart);
      const end = b.breakEnd ? new Date(b.breakEnd) : new Date();
      return sum + (end - start) / (1000 * 60);
    }, 0);
    const totalWorkMinutes = totalElapsed - totalBreakMinutes;
    const shiftMinutes = shiftDurationHours * 60;

    // Determine if there's overtime
    const hasOvertime = totalWorkMinutes > shiftMinutes;
    const regularWorkMinutes = hasOvertime ? shiftMinutes : totalWorkMinutes;
    const overtimeMinutes = hasOvertime ? totalWorkMinutes - shiftMinutes : 0;

    let regularWorkUsed = 0;
    let overtimeWorkUsed = 0;

    // Build segments alternating between work and breaks

    sortedBreaks.forEach((breakItem, index) => {
      const breakStart = new Date(breakItem.breakStart);
      const breakEnd = breakItem.breakEnd
        ? new Date(breakItem.breakEnd)
        : new Date();

      // Add work segment before this break
      if (currentTime < breakStart) {
        const workDuration = (breakStart - currentTime) / (1000 * 60);

        // Determine if this segment is regular work or overtime
        if (regularWorkUsed + workDuration <= regularWorkMinutes) {
          // This is regular work
          segments.push({
            type: "work",
            startTime: new Date(currentTime),
            endTime: breakStart,
            duration: workDuration,
          });
          regularWorkUsed += workDuration;
        } else if (regularWorkUsed < regularWorkMinutes) {
          // Split: part regular, part overtime
          const remainingRegular = regularWorkMinutes - regularWorkUsed;
          const regularEndTime = new Date(
            currentTime.getTime() + remainingRegular * 60 * 1000,
          );

          segments.push({
            type: "work",
            startTime: new Date(currentTime),
            endTime: regularEndTime,
            duration: remainingRegular,
          });

          segments.push({
            type: "overtime",
            startTime: regularEndTime,
            endTime: breakStart,
            duration: workDuration - remainingRegular,
          });

          regularWorkUsed += remainingRegular;
          overtimeWorkUsed += workDuration - remainingRegular;
        } else {
          // Pure overtime
          segments.push({
            type: "overtime",
            startTime: new Date(currentTime),
            endTime: breakStart,
            duration: workDuration,
          });
          overtimeWorkUsed += workDuration;
        }
      }

      // Add break segment
      segments.push({
        type: "break",
        breakType: breakItem.type,
        startTime: breakStart,
        endTime: breakEnd,
        duration: breakItem.duration || (breakEnd - breakStart) / (1000 * 60),
        isOngoing: !breakItem.breakEnd,
      });

      currentTime = new Date(breakEnd);
    });

    // Add final work segment after last break
    if (attendance.punchOut?.time) {
      const punchOutTime = new Date(attendance.punchOut.time);
      if (currentTime < punchOutTime) {
        const workDuration = (punchOutTime - currentTime) / (1000 * 60);

        if (regularWorkUsed + workDuration <= regularWorkMinutes) {
          segments.push({
            type: "work",
            startTime: new Date(currentTime),
            endTime: punchOutTime,
            duration: workDuration,
          });
        } else if (regularWorkUsed < regularWorkMinutes) {
          const remainingRegular = regularWorkMinutes - regularWorkUsed;
          const regularEndTime = new Date(
            currentTime.getTime() + remainingRegular * 60 * 1000,
          );

          segments.push({
            type: "work",
            startTime: new Date(currentTime),
            endTime: regularEndTime,
            duration: remainingRegular,
          });

          segments.push({
            type: "overtime",
            startTime: regularEndTime,
            endTime: punchOutTime,
            duration: workDuration - remainingRegular,
          });
        } else {
          segments.push({
            type: "overtime",
            startTime: new Date(currentTime),
            endTime: punchOutTime,
            duration: workDuration,
          });
        }
      }
    } else {
      // Currently working
      const now = new Date();
      if (currentTime < now) {
        const workDuration = (now - currentTime) / (1000 * 60);

        if (regularWorkUsed + workDuration <= regularWorkMinutes) {
          segments.push({
            type: "work",
            startTime: new Date(currentTime),
            endTime: now,
            duration: workDuration,
            isOngoing: true,
          });
        } else if (regularWorkUsed < regularWorkMinutes) {
          const remainingRegular = regularWorkMinutes - regularWorkUsed;
          const regularEndTime = new Date(
            currentTime.getTime() + remainingRegular * 60 * 1000,
          );

          segments.push({
            type: "work",
            startTime: new Date(currentTime),
            endTime: regularEndTime,
            duration: remainingRegular,
          });

          segments.push({
            type: "overtime",
            startTime: regularEndTime,
            endTime: now,
            duration: workDuration - remainingRegular,
            isOngoing: true,
          });
        } else {
          segments.push({
            type: "overtime",
            startTime: new Date(currentTime),
            endTime: now,
            duration: workDuration,
            isOngoing: true,
          });
        }
      }
    }

    return segments;
  }, [attendance]);

  // Calculate total duration for percentage
  const totalDuration = useMemo(() => {
    return timelineSegments.reduce((sum, seg) => sum + seg.duration, 0);
  }, [timelineSegments]);

  // Filter only breaks for the list
  const breakSegments = useMemo(() => {
    return timelineSegments.filter((seg) => seg.type === "break");
  }, [timelineSegments]);

  const getSegmentColor = (segment) => {
    switch (segment.type) {
      case "work":
        return "bg-green-500";
      case "break":
        return "bg-yellow-400";
      case "overtime":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const getSegmentLabel = (segment) => {
    switch (segment.type) {
      case "work":
        return "Working";
      case "break":
        return segment.breakType;
      case "overtime":
        return "Overtime";
      default:
        return "Unknown";
    }
  };

  if (!stats) return null;

  return (
    <>
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
        <div className="flex-1">
          <div className="space-y-2 h-full flex flex-col justify-between">
            <div className="p-4 rounded-xl border border-gray-300 dark:border-gray-600  shadow-[0_0_10px_rgba(0,0,0,0.12)] dark:shadow-[0_0_10px_rgba(255,255,255,0.06)]">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                <TimelineStat
                  label="Total Hours"
                  value={hoursToHM(stats.totalHours)}
                  dot="bg-gray-400"
                />

                <TimelineStat
                  label="Productive Hours"
                  value={hoursToHM(stats.productiveHours)}
                  dot="bg-green-500"
                />

                <TimelineStat
                  label="Break Hours"
                  value={minutesToHM(stats.breakMinutes)}
                  dot="bg-yellow-400"
                />

                <TimelineStat
                  label="Overtime"
                  value={hoursToHM(stats.overtimeHours)}
                  dot="bg-blue-500"
                />
              </div>
              {/* Dynamic Timeline Bar with Time Labels */}
              {timelineSegments.length > 0 && (
                <div className="space-y-2">
                  {/* Timeline Bar */}
                  <div className="w-full h-10 rounded-lg overflow-hidden flex ">
                    {timelineSegments.map((segment, index) => {
                      const widthPercentage =
                        (segment.duration / totalDuration) * 100;

                      let bgColor = getSegmentColor(segment);
                      if (segment.isOngoing) {
                        bgColor += " animate-pulse";
                      }

                      return (
                        <div
                          key={index}
                          className={`${bgColor} relative group cursor-pointer transition-all hover:opacity-80`}
                          style={{ width: `${widthPercentage}%` }}
                          title={`${getSegmentLabel(segment)}: ${formatTime(segment.startTime)} - ${formatTime(segment.endTime)}`}
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                            <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              {getSegmentLabel(segment)}
                              <br />
                              {formatTime(segment.startTime)} -{" "}
                              {formatTime(segment.endTime)}
                              <br />
                              {minutesToHM(segment.duration)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* {breakSegments.length > 0 && (
                    <>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-4">
                        Break Details
                      </p>

                      <div className="mt-2 space-y-2 max-h-36 overflow-y-auto">
                        {breakSegments.map((segment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xs border border-yellow-200 dark:border-yellow-800"
                          >
                            <div className="flex items-center gap-2">
                            
                              <div>
                                {segment.breakType == "Tea-Break" ? (
                                  <Coffee size={14} />
                                ) : segment.breakType == "Lunch-Break" ? (
                                  <Utensils size={14} />
                                ) : segment.breakType == "Personal-Break" ? (
                                  <BedDouble size={14} />
                                ) : (
                                  <Soup size={14} />
                                )}
                              </div>

                              <span className="font-medium capitalize">
                                {segment.breakType} Break
                                {segment.isOngoing && (
                                  <span className="ml-1 text-blue-600 dark:text-blue-400">
                                    (Ongoing)
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                              <span>
                                {formatTime(segment.startTime)} -{" "}
                                {formatTime(segment.endTime)}
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {minutesToHM(segment.duration)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {breakSegments.length === 0 && (
                    <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      No breaks taken yet
                    </div>
                  )} */}
                </div>
              )}
            </div>
            <div>
              {/* Detailed Break List - Only showing breaks */}
              {timelineSegments.length > 0 && (
                <div
                  className={`min-h-[190px] ${breakSegments.length > 0 ? "" : "flex justify-center items-center"}  p-4 rounded-xl border border-gray-300 dark:border-gray-600  shadow-[0_0_10px_rgba(0,0,0,0.12)] dark:shadow-[0_0_10px_rgba(255,255,255,0.06)]`}
                >
                  {breakSegments.length > 0 ? (
                    <>
                      <p className="text-sm text-center font-semibold text-gray-700 dark:text-gray-300 ">
                        Break History
                      </p>

                      <div className=" space-y-1 max-h-36 overflow-y-auto">
                        {breakSegments.map((segment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2  text-xs border-b border-gray-300 dark:border-gray-600"
                          >
                            <div className="flex items-center gap-2">
                              <div>
                                {segment.breakType === "Tea-Break" ? (
                                  <Coffee size={14} />
                                ) : segment.breakType === "Lunch-Break" ? (
                                  <Utensils size={14} />
                                ) : segment.breakType === "Personal-Break" ? (
                                  <BedDouble size={14} />
                                ) : (
                                  <Soup size={14} />
                                )}
                              </div>

                              <span className="font-medium capitalize">
                                {segment.breakType} Break
                                {segment.isOngoing && (
                                  <span className="ml-1 text-blue-600 dark:text-blue-400">
                                    (Ongoing)
                                  </span>
                                )}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                              <span>
                                {formatTime(segment.startTime)} -{" "}
                                {formatTime(segment.endTime)}
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {minutesToHM(segment.duration)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <Coffee className="w-8 h-8 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">No breaks taken yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <div className="min-h-[90px] p-4 rounded-xl border border-gray-300 dark:border-gray-600  shadow-[0_0_10px_rgba(0,0,0,0.12)] dark:shadow-[0_0_10px_rgba(255,255,255,0.06)]">
                {attendance?.punchIn?.location ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Punch In Location
                    </p>
                    <div className="flex items-start space-x-2">
                      <MapPin size={16} />
                      <div>
                        <p className="text-sm">
                          {attendance?.punchIn?.location?.address ||
                            "Location captured"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {attendance.punchIn.device?.os} -{" "}
                          {attendance.punchIn.device?.browser}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No Punch In location</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const TimelineStat = ({ label, value, dot }) => (
  <div>
    <div className="flex items-center gap-1">
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
        {label}
      </p>
    </div>
    <h3 className="ml-4 font-semibold text-lg text-gray-900 dark:text-white ">
      {value}
    </h3>
  </div>
);

export default AttendanceStats;
