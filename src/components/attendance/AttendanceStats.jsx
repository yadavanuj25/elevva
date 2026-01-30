import React, { useMemo } from "react";
import StatCard from "./StatCard";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle,
  TrendingUp,
  XCircle,
} from "lucide-react";

const AttendanceStats = ({ attendance }) => {
  const stats = useMemo(() => {
    if (!attendance) return null;
    const productiveHours = attendance.workingHours || 0;
    const overtimeHours = attendance.overtimeHours || 0;
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
  const minutesToHM = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h > 0 ? `${h}h ` : ""}${m}m`;
  };

  const hoursToHM = (hours) => {
    const totalMins = Math.round(hours * 60);
    return minutesToHM(totalMins);
  };

  if (!stats) return null;

  /** percentages for bar */
  const totalForBar =
    stats.productiveHours + stats.overtimeHours + stats.breakMinutes / 60;
  const productivePct = (stats.productiveHours / totalForBar) * 100;
  const breakPct = (stats.breakMinutes / 60 / totalForBar) * 100;
  const overtimePct = (stats.overtimeHours / totalForBar) * 100;
  return (
    <>
      <div className="col-span-12 lg:col-span-4  flex flex-col gap-4">
        {/* <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-3">
          <StatCard
            bgColor="bg-orange-50"
            iconBg="bg-orange-500"
            value="8.36"
            total="9"
            label="Today"
            trend="5% This Week"
            up
          />
          <StatCard
            bgColor="bg-green-50"
            iconBg="bg-green-500"
            value="10"
            total="40"
            label="Week"
            trend="7% Last Week"
            up
          />
          <StatCard
            bgColor="bg-blue-50"
            iconBg="bg-blue-500"
            value="75"
            total="98"
            label="Month"
            trend="8% Last Month"
          />
          <StatCard
            bgColor="bg-pink-50"
            iconBg="bg-pink-500"
            value="16"
            total="28"
            label="Overtime"
            trend="6% Last Month"
          />
        </div> */}

        <div className="flex-1">
          <div className="h-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-4 flex flex-col justify-between">
            <div>
              {/*  Stats  */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                <TimelineStat
                  label="Total Working hours"
                  value={hoursToHM(stats.totalHours)}
                  dot="bg-gray-400"
                />

                <TimelineStat
                  label="Productive Hours"
                  value={hoursToHM(stats.productiveHours)}
                  dot="bg-green-500"
                />

                <TimelineStat
                  label="Break hours"
                  value={minutesToHM(stats.breakMinutes)}
                  dot="bg-yellow-400"
                />

                <TimelineStat
                  label="Overtime"
                  value={hoursToHM(stats.overtimeHours)}
                  dot="bg-blue-500"
                />
              </div>
              {/*  Dynamic Timeline Bar  */}
              <div className="w-full h-10 rounded-lg overflow-hidden flex">
                {productivePct > 0 && (
                  <div
                    className="bg-green-500"
                    style={{ width: `${productivePct}%` }}
                  />
                )}

                {breakPct > 0 && (
                  <div
                    className="bg-yellow-400"
                    style={{ width: `${breakPct}%` }}
                  />
                )}

                {overtimePct > 0 && (
                  <div
                    className="bg-blue-500"
                    style={{ width: `${overtimePct}%` }}
                  />
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
