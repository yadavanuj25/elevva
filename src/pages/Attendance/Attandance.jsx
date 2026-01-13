import EmployeeProfileCard from "../../components/attendance/EmployeeProfileCard";
import LeaveSummary from "../../components/attendance/LeaveSummary";
import AttendanceSummary from "../../components/attendance/PunchInOut";
import SuccessBanner from "../../components/attendance/SuccessBanner";
import WorkingHoursTimeline from "../../components/attendance/WorkingHoursTimeline";

export default function Attandance() {
  return (
    <div className="min-h-screen space-y-4">
      <SuccessBanner message='Your leave request on "24 April 2024" was approved!' />
      <div>
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
