import React from "react";
import StatCard from "./StatCard";
import AttendanceCard from "./AttendanceCard";

export default function AttendanceSummary() {
  return (
    <div className="grid grid-cols-12 gap-4 items-stretch">
      <div className="col-span-12 lg:col-span-4 h-full">
        <div className="h-full bg-accent-light dark:bg-gray-800 border border-accent-dark dark:border-gray-600 rounded-lg p-4 ">
          <AttendanceCard />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-8 h-full flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            iconBg="bg-orange-500"
            value="8.36"
            total="9"
            label="Today"
            trend="5% This Week"
            up
          />
          <StatCard
            iconBg="bg-gray-900"
            value="10"
            total="40"
            label="Week"
            trend="7% Last Week"
            up
          />
          <StatCard
            iconBg="bg-blue-500"
            value="75"
            total="98"
            label="Month"
            trend="8% Last Month"
          />
          <StatCard
            iconBg="bg-pink-500"
            value="16"
            total="28"
            label="Overtime"
            trend="6% Last Month"
          />
        </div>

        {/* Timeline (fills remaining height) */}
        <div className="flex-1">
          <div className="h-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <TimelineStat
                  label="Total Working hours"
                  value="12h 36m"
                  dot="bg-gray-400"
                />
                <TimelineStat
                  label="Productive Hours"
                  value="08h 36m"
                  dot="bg-green-500"
                />
                <TimelineStat
                  label="Break hours"
                  value="22m 15s"
                  dot="bg-yellow-400"
                />
                <TimelineStat
                  label="Overtime"
                  value="02h 15m"
                  dot="bg-blue-500"
                />
              </div>

              <div className="w-full h-10 rounded-lg overflow-hidden flex">
                <div className="bg-green-500 w-[35%]" />
                <div className="bg-yellow-400 w-[8%]" />
                <div className="bg-green-500 w-[40%]" />
                <div className="bg-yellow-400 w-[10%]" />
                <div className="bg-blue-500 w-[7%]" />
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-4">
              {[
                "06",
                "07",
                "08",
                "09",
                "10",
                "11",
                "12",
                "01",
                "02",
                "03",
                "04",
                "05",
              ].map((t) => (
                <span key={t}>{t}:00</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TimelineStat = ({ label, value, dot }) => (
  <div>
    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </p>
    <h3 className="font-bold text-xl text-gray-900 dark:text-white mt-1">
      {value}
    </h3>
  </div>
);
