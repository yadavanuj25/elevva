import { Calendar } from "lucide-react";

const WorkingHoursTimeline = () => {
  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Leave Details</h2>
        <div className="flex items-center gap-2 text-sm border rounded px-3 py-1">
          <Calendar className="w-4 h-4" />
          2024
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-4 pt-6">
        <Stat label="Total Leaves" value="12h 36m" />
        <Stat label="Taken" value="08h 36m" />
        <Stat label="Absent" value="22m 15s" />
        <Stat label="Request" value="02h 15m" />
        <Stat label="Worked Days" value="02h 15m" />
        <Stat label="Loss of Pay" value="02h 15m" />
      </div>

      <div>
        <button className="bg-black text-white  w-full justify-center items-center font-bold p-2 rounded ">
          Apply Here
        </button>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-md font-semibold">{value}</p>
  </div>
);

export default WorkingHoursTimeline;
