import React, { useState } from "react";
import LeaveStatusBadge from "./LeaveStatusBadge";
import ApproveRejectLeave from "../modals/leavesModal/ApproveRejectLeave";

const initialLeaves = [
  {
    id: "LV001",
    employee: "Anuj Yadav",
    type: "Sick Leave",
    dates: "10 Jan - 12 Jan",
    days: 3,
    status: "PENDING",
  },
  {
    id: "LV002",
    employee: "Rahul Singh",
    type: "Casual Leave",
    dates: "15 Jan",
    days: 1,
    status: "APPROVED",
  },
];

const LeaveTable = () => {
  const [leaves, setLeaves] = useState(initialLeaves);

  const updateStatus = (id, status, note = "") => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status, rejectionNote: note } : l))
    );
  };
  return (
    <div className="bg-white dark:bg-darkBg rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="table-th">Employee</th>
            <th className="table-th">Leave Type</th>
            <th className="table-th">Dates</th>
            <th className="table-th">Days</th>
            <th className="table-th">Status</th>
            <th className="table-th text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id} className="border-t dark:border-gray-700">
              <td className="table-td">{leave.employee}</td>
              <td className="table-td">{leave.type}</td>
              <td className="table-td">{leave.dates}</td>
              <td className="table-td">{leave.days}</td>
              <td className="table-td">
                <LeaveStatusBadge status={leave.status} />
              </td>
              <td className="table-td text-right">
                {leave.status === "PENDING" ? (
                  <ApproveRejectLeave leave={leave} onUpdate={updateStatus} />
                ) : (
                  <span className="text-gray-400 text-xs">No Action</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;
