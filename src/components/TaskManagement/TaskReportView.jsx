import React, { useState } from "react";
import { getTasksReport } from "../../services/taskServices";
import NoData from "../ui/NoData";
import { BarLoader } from "react-spinners";
import { swalError } from "../../utils/swalHelper";

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
      swalError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-900 dark:text-gray-100">
      {/* Filters Card */}
      <div className="bg-white dark:bg-[#1e2533] rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <h2 className=" mb-4">Task Report - Complete Visibility</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="w-full border border-[#E8E8E9] dark:border-gray-600 rounded-lg px-4 py-2 
              bg-white dark:bg-[#2a3142] text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="w-full border border-[#E8E8E9] dark:border-gray-600 rounded-lg px-4 py-2 
              bg-white dark:bg-[#2a3142] text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Button */}
          <div className="flex items-end">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
              dark:disabled:bg-gray-700 text-white py-2 rounded-lg transition"
            >
              {loading ? "Loading..." : "Generate Report"}
            </button>
          </div>
        </div>
      </div>

      {/* Report Table */}
      {loading ? (
        <div className="h-[70vh] flex justify-center items-center text-center py-10">
          <div className="w-[200px] text-black dark:text-white bg-gray-300 dark:bg-gray-700 rounded-full">
            <BarLoader
              height={6}
              width={200}
              color="currentColor"
              cssOverride={{ borderRadius: "999px" }}
            />
          </div>
        </div>
      ) : !loading && report.length > 0 ? (
        <div className="bg-white dark:bg-[#1e2533] rounded-lg shadow-md overflow-x-auto border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-[#2a3142]">
              <tr>
                {[
                  "Task Code",
                  "Requirement",
                  "Client",
                  "Assigned HR",
                  "Date",
                  "Sourced",
                  "Screened",
                  "Submitted",
                  "Accepted",
                  "To Client",
                  "Success Rate",
                  "Feedback",
                  "Rejections",
                ].map((heading, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium uppercase 
                    text-gray-600 dark:text-gray-300"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-[#1e2533] divide-y divide-gray-200 dark:divide-gray-700">
              {report.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-[#2a3142] transition"
                >
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

                  {/* Submitted to Client */}
                  <td className="px-4 py-3 text-center font-bold text-green-600 dark:text-green-400">
                    {row.profilesSubmittedToClient}
                  </td>

                  {/* Success Rate Color */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`font-bold ${
                        parseInt(row.successRate) >= 70
                          ? "text-green-600 dark:text-green-400"
                          : parseInt(row.successRate) >= 40
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
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
      ) : (
        <div className="  border border-[#E8E8E9] dark:border-gray-600 rounded-xl">
          <NoData title="No Data Found" />
        </div>
      )}
    </div>
  );
};

export default TaskReportView;
