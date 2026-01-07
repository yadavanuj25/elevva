import React from "react";
import {
  User,
  Phone,
  Mail,
  Building,
  Calendar,
  Clock,
  Coffee,
  Zap,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function HRMSDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Success Banner */}
      <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
        <span>Your Leave Request on"24th April 2024"has been Approved!!!</span>
        <button className="text-green-600 hover:text-green-800">×</button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Employee Profile */}
        <div className="col-span-3 bg-gray-900 text-white rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Stephan Peralt</h3>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  Senior Product Designer{" "}
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>{" "}
                  UI/UX Design
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Phone Number</p>
              <p className="text-white">+1 324 3453 545</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Email Address</p>
              <p className="text-white">Steperde124@example.com</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Report Office</p>
              <p className="text-white">Doglas Martini</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Joined on</p>
              <p className="text-white">15 Jan 2024</p>
            </div>
          </div>
        </div>

        {/* Middle Section - Leave Details */}
        <div className="col-span-5">
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Leave Details</h2>
              <span className="text-sm text-gray-500">📅 2024</span>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-teal-800 rounded-full"></div>
                  <span className="text-sm">
                    <strong>1254</strong> on time
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">
                    <strong>32</strong> Late Attendance
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">
                    <strong>658</strong> Work From Home
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">
                    <strong>14</strong> Absent
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">
                    <strong>68</strong> Sick Leave
                  </span>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#0f766e"
                      strokeWidth="20"
                      strokeDasharray="157 251"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="20"
                      strokeDasharray="41 251"
                      strokeDashoffset="-157"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="20"
                      strokeDasharray="27 251"
                      strokeDashoffset="-198"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="20"
                      strokeDasharray="13 251"
                      strokeDashoffset="-225"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="20"
                      strokeDasharray="5 251"
                      strokeDashoffset="-238"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Better than <strong>85%</strong> of Employees
            </p>
          </div>

          {/* Attendance Section */}
          <div className="bg-white rounded-lg border-2 border-orange-300 p-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-1">Attendance</p>
              <p className="text-lg font-semibold">08:35 AM, 11 Mar 2025</p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="8"
                    strokeDasharray="188 251"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-gray-500">Total Hours</p>
                  <p className="text-xl font-bold">5:45:32</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-white text-center py-2 rounded-lg mb-3">
              Production : 3.45 hrs
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Clock className="w-4 h-4" />
              <span>Punch In at 10.00 AM</span>
            </div>

            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition">
              Punch Out
            </button>
          </div>
        </div>

        {/* Right Section - Statistics */}
        <div className="col-span-4">
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Leave Details</h2>
              <span className="text-sm text-gray-500">📅 2024</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Total Leaves</p>
                <p className="text-3xl font-bold">16</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Taken</p>
                <p className="text-3xl font-bold">10</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Absent</p>
                <p className="text-3xl font-bold">2</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Request</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Worked Days</p>
                <p className="text-3xl font-bold">240</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loss of Pay</p>
                <p className="text-3xl font-bold">2</p>
              </div>
            </div>

            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition">
              Apply New Leave
            </button>
          </div>

          {/* Hours Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4">
              <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center mb-2">
                <Clock className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-2xl font-bold">
                8.36 <span className="text-sm text-gray-500">/ 9</span>
              </p>
              <p className="text-xs text-gray-500 mb-2">Total Hours Today</p>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>5% This Week</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center mb-2">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold">
                10 <span className="text-sm text-gray-500">/ 40</span>
              </p>
              <p className="text-xs text-gray-500 mb-2">Total Hours Week</p>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>7% Last Week</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">
                75 <span className="text-sm text-gray-500">/ 98</span>
              </p>
              <p className="text-xs text-gray-500 mb-2">Total Hours Month</p>
              <div className="flex items-center gap-1 text-xs text-red-600">
                <TrendingDown className="w-3 h-3" />
                <span>8% Last Month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="w-8 h-8 bg-pink-100 rounded flex items-center justify-center mb-2">
                <Zap className="w-4 h-4 text-pink-500" />
              </div>
              <p className="text-2xl font-bold">
                16 <span className="text-sm text-gray-500">/ 28</span>
              </p>
              <p className="text-xs text-gray-500 mb-2">Overtime this Month</p>
              <div className="flex items-center gap-1 text-xs text-red-600">
                <TrendingDown className="w-3 h-3" />
                <span>6% Last Month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Working Hours Timeline */}
        <div className="col-span-12 bg-white rounded-lg p-6">
          <div className="grid grid-cols-4 gap-6 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Working hours</p>
              <p className="text-2xl font-bold">12h 36m</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">🟢 Productive Hours</p>
              <p className="text-2xl font-bold">08h 36m</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">☕ Break hours</p>
              <p className="text-2xl font-bold">22m 15s</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">⚡ Overtime</p>
              <p className="text-2xl font-bold">02h 15m</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="flex h-8 gap-1 mb-2">
              <div className="flex-1 bg-green-500 rounded"></div>
              <div className="w-12 bg-yellow-500 rounded"></div>
              <div className="flex-1 bg-green-500 rounded"></div>
              <div className="w-16 bg-yellow-500 rounded"></div>
              <div className="flex-1 bg-green-500 rounded"></div>
              <div className="w-12 bg-yellow-500 rounded"></div>
              <div className="w-8 bg-blue-500 rounded"></div>
              <div className="w-8 bg-blue-600 rounded"></div>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>06:00</span>
              <span>07:00</span>
              <span>08:00</span>
              <span>09:00</span>
              <span>10:00</span>
              <span>11:00</span>
              <span>12:00</span>
              <span>01:00</span>
              <span>02:00</span>
              <span>03:00</span>
              <span>04:00</span>
              <span>05:00</span>
              <span>06:00</span>
              <span>07:00</span>
              <span>08:00</span>
              <span>09:00</span>
              <span>10:00</span>
              <span>11:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
