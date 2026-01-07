import React from "react";
import StatCard from "./StatCard";

export default function AttendanceSummary() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Attendance Card */}
      <div className="col-span-12 lg:col-span-4 bg-accent-light dark:bg-gray-800 border border-accent-dark dark:border-gray-600 rounded-lg p-6">
        <h3 className="text-center text-gray-600 dark:text-gray-400 font-medium">
          Attendance
        </h3>

        <p className="text-center font-bold text-lg mt-1 text-gray-900 dark:text-white">
          08:35 AM, 11 Mar 2025
        </p>

        {/* Circular Progress */}
        <div className="flex justify-center mt-6">
          <div
            className="relative w-40 h-40 rounded-full"
            style={{
              background: "conic-gradient(#22c55e 75%, #e5e7eb 0)",
            }}
          >
            <div className="absolute inset-3 bg-white dark:bg-gray-900 rounded-full flex flex-col items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Total Hours
              </p>
              <p className="font-bold text-lg text-gray-900 dark:text-white">
                5:45:32
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <span className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm px-4 py-1 rounded-lg">
            Production : 3.45 hrs
          </span>
        </div>

        <p className="text-center mt-4 text-accent-dark font-medium">
          ☝ Punch In at 10.00 AM
        </p>

        <button className="mt-6 w-full bg-accent-dark hover:opacity-80 text-white py-2 rounded-lg font-semibold">
          Punch Out
        </button>
      </div>

      {/* Stat Cards */}
      <div className="col-span-12 lg:col-span-8 space-y-4">
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
        {/* Timeline */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm p-6">
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
