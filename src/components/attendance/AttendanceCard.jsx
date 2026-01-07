import { Clock } from "lucide-react";

const AttendanceCard = () => {
  return (
    <div className="bg-white rounded-lg border-2 border-orange-300 p-6">
      <p className="text-center text-lg font-semibold mb-4">
        08:35 AM, 11 Mar 2025
      </p>

      <div className="text-center mb-4">
        <p className="text-gray-500 text-sm">Total Hours</p>
        <p className="text-2xl font-bold">5:45:32</p>
      </div>

      <div className="bg-gray-900 text-white text-center py-2 rounded mb-3">
        Production : 3.45 hrs
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Clock className="w-4 h-4" />
        Punch In at 10:00 AM
      </div>

      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg">
        Punch Out
      </button>
    </div>
  );
};

export default AttendanceCard;
