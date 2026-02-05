import React from "react";
import AttendanceTracker from "./AttendanceTracker";

export default function AttendanceSummary() {
  return (
    <div className="grid grid-cols-12 gap-4 items-stretch">
      <div className="col-span-12  h-full">
        <AttendanceTracker />
      </div>
    </div>
  );
}
