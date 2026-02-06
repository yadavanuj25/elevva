import React, { useState, useEffect, useRef } from "react";
import TaskQuickViewModal from "../TaskManagement/TaskQuickViewModal";
import { updateMetrics, updateTaskStatus } from "../../services/taskServices";
import CustomSwal from "../../utils/CustomSwal";
import { getAllProfiles } from "../../services/profileServices";

const priorityColors = {
  Critical: " text-red-800 border-red-500",
  High: " text-orange-800 border-red-300",
  Medium: " text-yellow-800 border-yellow-500",
  Low: " text-green-800 border-green-500",
};
const priority = {
  Critical: "bg-red-900  border-red-300",
  High: " bg-red-600 border-orange-300",
  Medium: " bg-yellow-600 border-yellow-300",
  Low: " bg-green-600 border-green-300",
};

const TaskCard = ({ task, onClick, onRefresh, onDragStart }) => {
  const [showMetricsForm, setShowMetricsForm] = useState(false);
  const [metrics, setMetrics] = useState(task.metrics);
  const [showQuickView, setShowQuickView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [openSelect, setOpenSelect] = useState(false);
  const [search, setSearch] = useState("");

  const debounceTimeout = useRef(null);
  const originalMetricsRef = useRef(task.metrics);
  const originalSelectedOptionsRef = useRef([]);

  useEffect(() => {
    if (showMetricsForm) {
      fetchProfiles("");
    }
  }, [showMetricsForm]);

  useEffect(() => {
    if (!openSelect) return;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchProfiles(search);
    }, 300);
    return () => clearTimeout(debounceTimeout.current);
  }, [search]);

  const fetchProfiles = async (searchTerm = "") => {
    try {
      const data = await getAllProfiles(1, 10, "All", searchTerm);
      setOptions(data.profiles || []);
    } catch (error) {
      console.error("Dropdown profile fetch failed", error);
    }
  };

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.some((o) => o._id === option._id)
        ? prev.filter((o) => o._id !== option._id)
        : [...prev, option],
    );
  };

  const handleMetricsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateMetrics(task._id, metrics);
      CustomSwal.fire({
        text: res?.message || "Task status updated successfully",
        icon: "success",
        showConfirmButton: true,
      });
      setShowMetricsForm(false);
      onRefresh();
    } catch (error) {
      CustomSwal.fire({
        text: error || "Failed to update task",
        icon: "error",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const res = await updateTaskStatus(task._id, { status });
      CustomSwal.fire({
        text: res?.message || "Task status updated successfully",
        icon: "success",
        showConfirmButton: true,
      });
      onRefresh();
    } catch (error) {
      CustomSwal.fire({
        text: error || "Failed to update task",
        icon: "error",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task)}
      className={`border-2 ${priorityColors[task.priority]} rounded-lg p-3
      bg-white dark:bg-[#1e2533]
      border-gray-200 dark:border-gray-700
      hover:shadow-md transition-shadow`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between ">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {task.requirement?.client?.clientName}
          </p>
          <span
            className={`text-xs text-white px-2.5 py-0.5 rounded-full ${
              priority[task.priority]
            }`}
          >
            {task.priority}
          </span>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300">
          {task.requirement?.techStack}
        </p>

        <p className="text-xs text-gray-900 dark:text-gray-200 mb-3">
          {task.requirement?.requirementCode}
        </p>

        {/* Metrics */}
        {/* <div className="shadow rounded-md py-2 mb-3 text-xs bg-gray-100 dark:bg-[#202b3a]">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Sourced", value: metrics?.profilesSourced || 0 },
              { label: "Screened", value: metrics?.profilesScreened || 0 },
              { label: "Submitted", value: metrics?.profilesSubmitted || 0 },
              {
                label: "Accepted",
                value: metrics?.profilesAcceptedBySales || 0,
              },
            ].map((metric, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-gray-600 dark:text-gray-300"
              >
                <span>{metric.label}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div> */}

        {/* Metrics Form */}
        {showMetricsForm ? (
          <form
            onSubmit={handleMetricsSubmit}
            className="space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Profile Select */}
            <div className="relative">
              <label className="text-xs text-gray-600 dark:text-gray-300">
                Select Profiles
              </label>
              <div
                onClick={() => setOpenSelect(!openSelect)}
                className="min-h-[30px] cursor-pointer flex flex-wrap gap-1 items-center border rounded px-2 py-1 text-sm bg-white dark:bg-[#1e2738] border-gray-300 dark:border-gray-600"
              >
                {selectedOptions.length === 0 && (
                  <span className="text-gray-400">Select options</span>
                )}
                {selectedOptions.map((opt) => (
                  <span
                    key={opt._id}
                    className="bg-accent-light text-accent-dark px-2 py-0.5 rounded text-xs flex items-center gap-1 capitalize"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {opt.fullName}
                    <button
                      type="button"
                      onClick={() => toggleOption(opt)}
                      className="text-xs "
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              {openSelect && (
                <div
                  className="absolute z-20 mt-1 w-full border rounded bg-white dark:bg-[#1e2738] border-gray-300 dark:border-gray-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="search"
                    placeholder="Search by name, email or phone..."
                    className="w-full bg-white dark:bg-darkBg p-2 border-b border-gray-300 dark:border-gray-600 rounded focus:outline-none  "
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="max-h-40 overflow-y-auto">
                    {options.map((option) => {
                      const isSelected = selectedOptions.some(
                        (o) => o._id === option._id,
                      );
                      return (
                        <div
                          key={option._id}
                          onClick={() => toggleOption(option)}
                          className={`px-2 py-1 text-sm cursor-pointer text-gray-700 dark:text-gray-100
                            hover:bg-gray-200 dark:hover:bg-gray-700 capitalize
                            ${
                              isSelected ? "bg-gray-100 dark:bg-gray-600" : ""
                            }`}
                        >
                          {option.fullName} - {option.submittedBy.fullName}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Metrics Inputs */}
            {/* <div className="grid grid-cols-2 gap-2">
              {[
                { key: "profilesSourced", placeholder: "Sourced" },
                { key: "profilesScreened", placeholder: "Screened" },
                { key: "profilesSubmitted", placeholder: "Submitted" },
                { key: "profilesAcceptedBySales", placeholder: "Accepted" },
                { key: "profilesSubmittedToClient", placeholder: "To Client" },
              ].map((field, i) => (
                <div key={i}>
                  <label className="text-xs text-gray-600 dark:text-gray-300">
                    {field.placeholder}
                  </label>
                  <input
                    type="number"
                    placeholder={field.placeholder}
                    value={metrics[field.key]}
                    onChange={(e) =>
                      setMetrics({
                        ...metrics,
                        [field.key]: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    className="w-full border rounded py-1 px-2 text-sm bg-white dark:bg-[#1e2738] text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
              ))}
            </div> */}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
              >
                {loading ? "Saving ..." : "Save"}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMetrics(originalMetricsRef.current);
                  setSelectedOptions(originalSelectedOptionsRef.current);
                  setSearch("");
                  setOpenSelect(false);
                  setShowMetricsForm(false);
                }}
                className="flex-1 bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <select
              value={task.status}
              onChange={(e) => {
                e.stopPropagation();
                handleStatusChange(e.target.value);
              }}
              className="w-full border rounded py-1 px-2 text-sm bg-white dark:bg-[#1e2738] text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            >
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMetricsForm(true);
                }}
                className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
              >
                Update
              </button>
              <button
                className="bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
              >
                View
              </button>
              <button
                className="bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700"
                onClick={onClick}
              >
                Action
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {task.taskCode}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Assigned by:{" "}
            <span className="font-semibold">{task.assignedBy?.fullName}</span>
          </p>
        </div>

        {/* Quick View Modal */}
        {showQuickView && (
          <TaskQuickViewModal
            task={task}
            onClose={() => setShowQuickView(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TaskCard;
