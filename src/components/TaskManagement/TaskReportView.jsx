import React, { useState } from "react";
import { getTasksReport } from "../../services/taskServices";
const TaskReportView = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    assignedTo: "",
  });

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.assignedTo) params.append("assignedTo", filters.assignedTo);
      const response = await getTasksReport(params.toString());
      setReport(response.report);
    } catch (error) {
      alert("Error fetching report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Task Report - Complete Visibility
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Loading..." : "Generate Report"}
            </button>
          </div>
        </div>
      </div>

      {report.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Task Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Requirement
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Assigned HR
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sourced
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Screened
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Submitted
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Accepted
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  To Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Success Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Feedback
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rejections
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {report.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{row.taskCode}</td>
                  <td className="px-4 py-3">{row.requirementName}</td>
                  <td className="px-4 py-3">{row.clientName}</td>
                  <td className="px-4 py-3">{row.assignedHR}</td>
                  <td className="px-4 py-3">
                    {new Date(row.dateOfAssignment).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.profilesSourced}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.profilesScreened}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.profilesSubmitted}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.profilesAcceptedBySales}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-green-600">
                    {row.profilesSubmittedToClient}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`font-bold ${
                        parseInt(row.successRate) >= 70
                          ? "text-green-600"
                          : parseInt(row.successRate) >= 40
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {row.successRate}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{row.feedbackCount}</td>
                  <td className="px-4 py-3 text-center">
                    {row.rejectionCount}
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
export default TaskReportView;
