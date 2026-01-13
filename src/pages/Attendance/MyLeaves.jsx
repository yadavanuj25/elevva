import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getMyLeaves } from "../../services/leaveService";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const MyLeaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaves = async () => {
      const data = await getMyLeaves(user.id);
      setLeaves(data);
      setLoading(false);
    };
    loadLeaves();
  }, [user.id]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading leaves...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1">My Leaves</h2>
      <p className="text-sm text-gray-500 mb-4">
        Track all your leave applications
      </p>

      <div className="bg-white dark:bg-gray-800 border rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">Leave Type</th>
              <th className="p-3 text-left">From</th>
              <th className="p-3 text-left">To</th>
              <th className="p-3 text-left">Days</th>
              <th className="p-3 text-left">Applied On</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No leave records found
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave.id} className="border-t dark:border-gray-700">
                  <td className="p-3">{leave.leaveType}</td>
                  <td className="p-3">{leave.fromDate}</td>
                  <td className="p-3">{leave.toDate}</td>
                  <td className="p-3">{leave.totalDays}</td>
                  <td className="p-3">{leave.appliedAt}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        statusStyles[leave.status]
                      }`}
                    >
                      {leave.status}
                    </span>
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

export default MyLeaves;
