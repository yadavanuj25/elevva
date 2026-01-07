import React from "react";
import { ArrowUp, ArrowDown, Settings } from "lucide-react";

const StatCard = ({ iconBg, value, total, label, trend, up }) => (
  <div className="bg-white border border-gray-300 drak:border-gray-600 rounded-xl shadow-sm p-5 w-full">
    <div
      className={`w-9 h-9 rounded-md flex items-center justify-center ${iconBg}`}
    >
      <span className="text-white font-bold">⏱</span>
    </div>

    <h2 className="mt-4 text-2xl font-bold">
      {value} <span className="text-gray-400 font-medium">/ {total}</span>
    </h2>

    <p className="text-gray-600 mt-1">{label}</p>
    <hr className="my-3" />

    <div
      className={`flex items-center gap-2 text-sm ${
        up ? "text-green-600" : "text-red-600"
      }`}
    >
      {up ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
      {trend}
    </div>
  </div>
);

export default function AttendanceSummary() {
  return (
    <div>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-4 bg-orange-50 border border-orange-400 rounded-xl p-6 relative">
          <h3 className="text-center text-gray-600 font-medium">Attendance</h3>
          <p className="text-center font-bold text-lg mt-1">
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
              <div className="absolute inset-3 bg-white rounded-full flex flex-col items-center justify-center text-center">
                <p className="text-gray-500 text-sm">Total Hours</p>
                <p className="font-bold text-lg">5:45:32</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <span className="bg-black text-white text-sm px-4 py-1 rounded-md">
              Production : 3.45 hrs
            </span>
          </div>

          <p className="text-center mt-4 text-orange-600 font-medium">
            ☝ Punch In at 10.00 AM
          </p>

          <button className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold">
            Punch Out
          </button>
        </div>

        {/* Stats Cards */}
        <div className="col-span-12 lg:col-span-8  relative">
          <div className="flex items-center gap-2">
            <StatCard
              iconBg="bg-orange-500"
              value="8.36"
              total="9"
              label="Total Hours Today"
              trend="5% This Week"
              up
            />
            <StatCard
              iconBg="bg-gray-900"
              value="10"
              total="40"
              label="Total Hours Week"
              trend="7% Last Week"
              up
            />
            <StatCard
              iconBg="bg-blue-500"
              value="75"
              total="98"
              label="Total Hours Month"
              trend="8% Last Month"
            />
            <StatCard
              iconBg="bg-pink-500"
              value="16"
              total="28"
              label="Overtime this Month"
              trend="6% Last Month"
            />
          </div>
        </div>
        {/* Timeline Card */}
        <div className="col-span-12 lg:col-span-8 relative">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-gray-500 flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  Total Working hours
                </p>
                <h3 className="font-bold text-xl mt-1">12h 36m</h3>
              </div>

              <div>
                <p className="text-gray-500 flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Productive Hours
                </p>
                <h3 className="font-bold text-xl mt-1">08h 36m</h3>
              </div>

              <div>
                <p className="text-gray-500 flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  Break hours
                </p>
                <h3 className="font-bold text-xl mt-1">22m 15s</h3>
              </div>

              <div>
                <p className="text-gray-500 flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Overtime
                </p>
                <h3 className="font-bold text-xl mt-1">02h 15m</h3>
              </div>
            </div>
            <div className="w-full h-10 rounded-lg overflow-hidden flex">
              <div className="bg-green-500 w-[35%]"></div>
              <div className="bg-yellow-400 w-[8%]"></div>
              <div className="bg-green-500 w-[40%]"></div>
              <div className="bg-yellow-400 w-[10%]"></div>
              <div className="bg-blue-500 w-[7%]"></div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-4">
              {[
                "06:00",
                "07:00",
                "08:00",
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "01:00",
                "02:00",
                "03:00",
                "04:00",
                "05:00",
                "06:00",
                "07:00",
                "08:00",
                "09:00",
                "10:00",
                "11:00",
              ].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
