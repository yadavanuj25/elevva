import React, { useState, useEffect } from "react";
import { getAllTasks } from "../../services/taskServices";
import { BarLoader } from "react-spinners";
import { User } from "lucide-react";
import NoData from "../ui/NoData";

const AllTasksView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("card");

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  useEffect(() => {
    fetchAllTasks();
  }, [filters]);

  const fetchAllTasks = async () => {
    try {
      setLoading(true);

      const response = await getAllTasks(filters);

      if (response?.tasks) {
        setTasks(response.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group tasks by User
  const groupedTasks = tasks.reduce((acc, task) => {
    const user = task?.assignedTo?.fullName || "Unassigned";
    if (!acc[user]) acc[user] = [];
    acc[user].push(task);
    return acc;
  }, {});

  if (loading)
    return (
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
    );
  if (!loading && tasks.length === 0) return <NoData title="No Data Found" />;
  return (
    <div>
      {/* Filters */}
      <div className="bg-white dark:bg-[#31415f] border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-2xl font-bold">All Tasks</h2>
          {/* 🔥 View Toggle Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewType("table")}
              className={`px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 ${
                viewType === "table"
                  ? "bg-dark text-white hover:opacity-90 "
                  : "bg-white text-gray-700"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewType("card")}
              className={`px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 ${
                viewType === "card"
                  ? "bg-dark text-white hover:opacity-90 "
                  : "bg-white text-gray-700"
              }`}
            >
              Card View
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mt-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="bg-transparent dark:text-white border rounded px-4 py-2"
          >
            <option value="" className="text-darkBg">
              All Status
            </option>
            <option value="Assigned" className="text-darkBg">
              Assigned
            </option>
            <option value="In Progress" className="text-darkBg">
              In Progress
            </option>
            <option value="Completed" className="text-darkBg">
              Completed
            </option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
            className="bg-transparent dark:text-white border rounded px-4 py-2"
          >
            <option value="" className="text-darkBg">
              All Priority
            </option>
            <option value="Critical" className="text-darkBg">
              Critical
            </option>
            <option value="High" className="text-darkBg">
              High
            </option>
            <option value="Medium" className="text-darkBg">
              Medium
            </option>
            <option value="Low" className="text-darkBg ">
              Low
            </option>
          </select>
        </div>
      </div>

      {/* 🔥 CARD VIEW */}
      {viewType === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(groupedTasks).map((user) => (
            <div
              key={user}
              className="bg-white dark:bg-transparent rounded-xl shadow-md border border-gray-300 dark:border-gray-600 p-3 hover:shadow-lg transition"
            >
              <h2 className="flex items-center gap-2 text-lg font-semibold  mb-2">
                {" "}
                <User size={20} /> {user}
              </h2>

              <div className="space-y-4">
                {groupedTasks[user].map((task) => (
                  <div
                    key={task._id}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-200 dark:bg-[#31415f] "
                  >
                    <div className="text-sm font-medium ">
                      Client Name: {task.requirement.client.clientName}
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-200 mt-1">
                      Tech Stack: {task.requirement?.techStack}
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : task.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.status}
                      </span>

                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          task.priority === "Critical"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "High"
                            ? "bg-orange-100 text-orange-800"
                            : task.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 mb-2 text-xs text-gray-700">
                      <div>Sourced: {task.metrics.profilesSourced}</div>
                      <div>
                        To Client: {task.metrics.profilesSubmittedToClient}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {task.taskCode}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 TABLE VIEW */}
      {viewType === "table" && (
        <div className="space-y-10">
          {Object.keys(groupedTasks).map((user) => (
            <div
              key={user}
              className="bg-white dark:bg-[#1f2937] border border-gray-300 dark:border-gray-600 rounded-xl shadow-md p-6"
            >
              {/* User Title */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">👤</span>
                <h2 className="text-xl font-semibold">{user}</h2>
              </div>

              {/* Table Wrapper */}
              <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm">
                <table className="min-w-full">
                  <thead className="bg-gray-100 dark:bg-[#31415f]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide uppercase">
                        Task Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide uppercase">
                        Requirement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide uppercase">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide uppercase">
                        Metrics
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white dark:bg-[#1f2937] divide-y divide-gray-200 dark:divide-gray-700">
                    {groupedTasks[user].map((task) => (
                      <tr
                        key={task._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                      >
                        {/* Task Code */}
                        <td className="px-6 py-4 text-sm font-medium">
                          {task.taskCode}
                        </td>

                        {/* Requirement */}
                        <td className="px-6 py-4 text-sm">
                          {task.requirement?.techStack}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                              task.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : task.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>

                        {/* Priority */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                              task.priority === "Critical"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "High"
                                ? "bg-orange-100 text-orange-800"
                                : task.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>

                        {/* Metrics */}
                        <td className="px-6 py-4 text-sm">
                          <div className="text-xs space-y-1">
                            <div>Sourced: {task.metrics.profilesSourced}</div>
                            <div>
                              To Client:{" "}
                              {task.metrics.profilesSubmittedToClient}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTasksView;
