import AttendanceSummary from "../../components/attendance/AttendanceSummry";
import EmployeeProfileCard from "../../components/attendance/EmployeeProfileCard";
import LeaveSummary from "../../components/attendance/LeaveSummary";
import SuccessBanner from "../../components/attendance/SuccessBanner";
import WorkingHoursTimeline from "../../components/attendance/WorkingHoursTimeline";

export default function Attandance() {
  return (
    <div className="min-h-screen space-y-4">
      <div>
        <div className=" mb-2 animate-slideDown">
          <h2 className="text-2xl font-semibold  ">Attendance Tracker</h2>
        </div>
        <AttendanceSummary />
      </div>
      <div className="grid grid-cols-12 gap-3 items-stretch">
        <div className="col-span-4">
          <EmployeeProfileCard />
        </div>

        <div className="col-span-5">
          <LeaveSummary />
        </div>

        <div className="col-span-3">
          <WorkingHoursTimeline />
        </div>
      </div>
    </div>
  );
}
