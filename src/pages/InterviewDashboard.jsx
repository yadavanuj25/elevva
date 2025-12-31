import React, { useState } from "react";
import { useInterviews } from "../context/InterViewContext";

const InterviewDashboard = () => {
  const { interviewRecords } = useInterviews();
  const [remarks, setRemarks] = useState({});

  const handlePassScreening = (record) => {
    updateInterviewRecord(record._id, {
      stage: "CLIENT_L1",
      status: "Sent to Client (L1)",
      screeningRemark: remarks[record._id] || "",
    });

    setRemarks((prev) => ({ ...prev, [record._id]: "" }));
  };

  const handleReject = (record) => {
    const reason = prompt("Enter rejection reason");
    if (!reason) return;

    updateInterviewRecord(record._id, {
      stage: "REJECTED",
      status: "Rejected",
      rejectionReason: reason,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Interview Management</h1>

      {interviewRecords.length === 0 ? (
        <div className="text-gray-500">No interviews yet.</div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr className="text-left text-sm text-gray-700 dark:text-gray-200">
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Requirement</th>
                <th className="px-4 py-3">HR</th>
                <th className="px-4 py-3">BDE</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {interviewRecords.map((record) => (
                <tr
                  key={record._id}
                  className="border-t dark:border-gray-700 text-sm"
                >
                  <td className="px-4 py-3 font-medium">
                    {record.profileName}
                  </td>

                  <td className="px-4 py-3">{record.requirementTitle}</td>

                  <td className="px-4 py-3">{record.hrName}</td>

                  <td className="px-4 py-3">{record.bdeName}</td>

                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
                      {record.stage}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">
                      {record.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </td>

                  <td className="border p-2">
                    {record.stage === "BDE_SCREENING" && (
                      <div className="flex flex-col gap-2">
                        <input
                          className="border p-1 rounded"
                          placeholder="Screening remark"
                          value={remarks[record._id] || ""}
                          onChange={(e) =>
                            setRemarks((prev) => ({
                              ...prev,
                              [record._id]: e.target.value,
                            }))
                          }
                        />

                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded"
                          onClick={() => handlePassScreening(record)}
                        >
                          Pass → Client L1
                        </button>

                        <button
                          className="bg-red-600 text-white px-2 py-1 rounded"
                          onClick={() => handleReject(record)}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {record.stage === "REJECTED" && (
                      <span className="text-red-600 text-sm">
                        {record.rejectionReason}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InterviewDashboard;
