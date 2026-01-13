import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkingHoursTimeline = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4  shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-600">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Leave Details
        </h2>

        <div
          className="flex items-center gap-2 text-sm px-3 py-1 rounded-lg
                        border border-gray-300 dark:border-gray-600
                        text-gray-700 dark:text-gray-300"
        >
          <Calendar className="w-4 h-4" />
          2024
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 pt-6 mb-6">
        <Stat label="Total Leaves" value="12h 36m" />
        <Stat label="Taken" value="08h 36m" />
        <Stat label="Absent" value="22m 15s" />
        <Stat label="Request" value="02h 15m" />
        <Stat label="Worked Days" value="02h 15m" />
        <Stat label="Loss of Pay" value="02h 15m" />
      </div>

      {/* Action */}
      <button
        onClick={() => navigate("/attendance/leave-application")}
        className="w-full flex items-center justify-center font-semibold py-2 rounded-lg
                   bg-accent-dark text-white hover:opacity-80 
                    transition-colors"
      >
        Apply Leave
      </button>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    <p className="text-md font-semibold text-gray-900 dark:text-white">
      {value}
    </p>
  </div>
);

export default WorkingHoursTimeline;
