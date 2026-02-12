import React, { useState, useEffect } from "react";
import { getAllTasks } from "../../services/taskServices";
import { BarLoader } from "react-spinners";
import PageTitle from "../../hooks/PageTitle";
import { User } from "lucide-react";
import NoData from "../ui/NoData";
import SelectField from "../ui/SelectField";
import { getRequirementOptions } from "../../services/clientServices";

const AllTasksView = () => {
  PageTitle("Elevva | All Tasks");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("card");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });
  const [options, setOptions] = useState({});
  useEffect(() => {
    fetchAllTasks();
  }, [filters]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchAllTasks = async () => {
    setLoading(true);
    try {
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

  const fetchOptions = async () => {
    try {
      const res = await getRequirementOptions();
      setOptions(res.options);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Group tasks by User
  const groupedTasks = tasks.reduce((acc, task) => {
    const user = task?.assignedTo?.fullName || "Unassigned";
    if (!acc[user]) acc[user] = [];
    acc[user].push(task);
    return acc;
  }, {});

  return (
    <>
      <div className="bg-white dark:bg-[#1e2738] border border-[#E8E8E9] dark:border-gray-600 rounded-xl p-4 mb-6 ">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2>All Tasks</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewType("table")}
              className={`px-4 py-2 rounded-md border border-[#E8E8E9] dark:border-gray-600 ${
                viewType === "table"
                  ? "bg-accent-dark text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Table View
            </button>

            <button
              onClick={() => setViewType("card")}
              className={`px-4 py-2 rounded-md border border-[#E8E8E9] dark:border-gray-600 ${
                viewType === "card"
                  ? "bg-accent-dark text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Card View
            </button>
          </div>
        </div>

        <div className="mt-4 w-full md:w-1/2">
          <div className="flex gap-4">
            {/* Status */}
            <div className="flex-1">
              <SelectField
                name="status"
                label="Status"
                value={filters.status}
                handleChange={handleFilterChange}
                options={options.statuses}
              />
            </div>

            {/* Priority */}
            <div className="flex-1">
              <SelectField
                name="priority"
                label="Priority"
                value={filters.priority}
                handleChange={handleFilterChange}
                options={options.priorities}
              />
            </div>
          </div>
        </div>
      </div>

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
      ) : !loading && tasks.length === 0 ? (
        <div className="  border border-[#E8E8E9] dark:border-gray-600 rounded-xl">
          <NoData title="No Data Found" />
        </div>
      ) : (
        <>
          {viewType === "card" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(groupedTasks).map((user) => (
                <div
                  key={user}
                  className="bg-white dark:bg-transparent rounded-xl shadow-md border border-[#E8E8E9] dark:border-gray-600 p-3 hover:shadow-lg transition"
                >
                  <h2 className="flex items-center gap-2 text-lg font-semibold  mb-2">
                    {" "}
                    <User size={20} /> {user}
                  </h2>

                  <div className="space-y-4">
                    {groupedTasks[user].map((task) => (
                      <div
                        key={task._id}
                        className="border border-[#E8E8E9] dark:border-gray-600 rounded-lg p-4 bg-gray-200 dark:bg-[#31415f] "
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

          {viewType === "table" && (
            <div className="space-y-10">
              {Object.keys(groupedTasks).map((user) => (
                <div
                  key={user}
                  className="bg-white dark:bg-[#1f2937] border border-[#E8E8E9] dark:border-gray-600 rounded-xl shadow-md p-6"
                >
                  {/* User Title */}
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-2xl">👤</span>
                    <h2 className="text-xl font-semibold">{user}</h2>
                  </div>

                  {/* Table Wrapper */}
                  <div className="rounded-xl overflow-hidden border border-[#E8E8E9] dark:border-gray-600 shadow-sm">
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
                                <div>
                                  Sourced: {task.metrics.profilesSourced}
                                </div>
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
        </>
      )}
    </>
  );
};

export default AllTasksView;
