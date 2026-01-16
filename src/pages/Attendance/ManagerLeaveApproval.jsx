import React, { useEffect, useState } from "react";
import {
  getPendingLeaves,
  updateLeaveStatus,
} from "../../services/leaveService";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const ManagerLeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const loadLeaves = async () => {
      const data = await getPendingLeaves();
      setLeaves(data);
      setLoading(false);
    };
    loadLeaves();
  }, []);

  const handleApprove = async (id) => {
    await updateLeaveStatus(id, "Approved");
    setLeaves((prev) => prev.filter((l) => l.id !== id));
  };

  const handleReject = async (id) => {
    const reasonInput = prompt("Enter reason for rejection:");
    if (!reasonInput) return;
    await updateLeaveStatus(id, "Rejected", reasonInput);
    setLeaves((prev) => prev.filter((l) => l.id !== id));
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading pending leaves...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1">Manager Leave Approval</h2>
      <p className="text-sm text-gray-500 mb-4">
        Review and approve or reject leave requests
      </p>

      <div className="bg-white dark:bg-gray-800 border rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Leave Type</th>
              <th className="p-3 text-left">From</th>
              <th className="p-3 text-left">To</th>
              <th className="p-3 text-left">Days</th>
              <th className="p-3 text-left">Applied On</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No pending leaves
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave.id} className="border-t dark:border-gray-700">
                  <td className="p-3">{leave.employeeId}</td>
                  <td className="p-3">{leave.leaveType}</td>
                  <td className="p-3">{leave.fromDate}</td>
                  <td className="p-3">{leave.toDate}</td>
                  <td className="p-3">{leave.totalDays}</td>
                  <td className="p-3">{leave.appliedAt}</td>
                  <td className="p-3 space-x-2">
                    <button
                      className="px-2 py-1 text-white bg-green-600 rounded"
                      onClick={() => handleApprove(leave.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="px-2 py-1 text-white bg-red-600 rounded"
                      onClick={() => handleReject(leave.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerLeaveApproval;
