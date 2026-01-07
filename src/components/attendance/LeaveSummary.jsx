import { Calendar } from "lucide-react";

const LeaveSummary = () => {
  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Leave Details</h2>

        <div className="flex items-center gap-2 text-sm border rounded px-3 py-1">
          <Calendar className="w-4 h-4" />
          2024
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center gap-10 pt-6">
        {/* Legend */}
        <ul className="space-y-4 text-sm text-gray-600">
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#0B4A5A]" />
            <span>
              <b className="text-gray-900">1254</b> on time
            </span>
          </li>

          <li className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>
              <b className="text-gray-900">32</b> Late Attendance
            </span>
          </li>

          <li className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>
              <b className="text-gray-900">658</b> Work From Home
            </span>
          </li>

          <li className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>
              <b className="text-gray-900">14</b> Absent
            </span>
          </li>

          <li className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span>
              <b className="text-gray-900">68</b> Sick Leave
            </span>
          </li>
        </ul>

        {/* Donut Chart */}
        <div className="relative w-56 h-56">
          <svg viewBox="0 0 100 100" className="-rotate-90">
            {/* On Time */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#0B4A5A"
              strokeWidth="14"
              strokeDasharray="190 238"
            />

            {/* Work From Home */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#F97316"
              strokeWidth="14"
              strokeDasharray="45 238"
              strokeDashoffset="-190"
            />

            {/* Sick Leave */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#FACC15"
              strokeWidth="14"
              strokeDasharray="25 238"
              strokeDashoffset="-235"
            />

            {/* Late */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#22C55E"
              strokeWidth="14"
              strokeDasharray="12 238"
              strokeDashoffset="-260"
            />

            {/* Absent */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#EF4444"
              strokeWidth="14"
              strokeDasharray="6 238"
              strokeDashoffset="-272"
            />
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-6 text-sm text-gray-500">
        <input type="checkbox" className="rounded" />
        Better than <b className="text-gray-800">85%</b> of Employees
      </div>
    </div>
  );
};

export default LeaveSummary;
