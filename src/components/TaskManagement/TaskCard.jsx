import React, { useState } from "react";
import TaskQuickViewModal from "../TaskManagement/TaskQuickViewModal";
import { updateMetrics, updateTaskStatus } from "../../services/taskServices";
import Input from "../ui/Input";

const TaskCard = ({ task, onClick, onRefresh }) => {
  const [showMetricsForm, setShowMetricsForm] = useState(false);
  const [metrics, setMetrics] = useState(task.metrics);
  const [showQuickView, setShowQuickView] = useState(false);

  const priorityColors = {
    Critical: " text-red-800 border-red-300",
    High: " text-orange-800 border-orange-300",
    Medium: " text-yellow-800 border-yellow-300",
    Low: " text-green-800 border-green-300",
  };

  const handleMetricsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMetrics(task._id, metrics);
      alert("Metrics updated successfully!");
      setShowMetricsForm(false);
      onRefresh();
    } catch (error) {
      alert("Error updating metrics");
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const payload = {
        status: status,
      };
      await updateTaskStatus(task._id, payload);
      alert("Status updated!");
      onRefresh();
    } catch (error) {
      alert("Error updating status");
    }
  };

  return (
    <div
      className={`border-2 ${
        priorityColors[task.priority]
      } rounded-lg p-3 cursor-pointer hover:shadow-lg transition-shadow`}
    >
      {/* <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-mono text-gray-600">{task.taskCode}</span>
        <span
          className={`text-xs px-2 py-1 rounded ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div> */}

      <p className="text-sm font-semibold text-gray-900 mb-2">
        {task.requirement?.client?.clientName}
      </p>
      <p className="text-xs text-gray-700 mb-3">
        {task.requirement?.techStack}
      </p>
      <p className="text-xs text-gray-900 mb-3">
        {task.requirement?.requirementCode}
      </p>

      {/* Metrics */}
      <div className="shadow-md rounded py-2 mb-3 text-xs">
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center">
            <span className="text-gray-600">Sourced</span>
            <span className="font-bold ml-1">
              {task.metrics.profilesSourced}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-600">Screened</span>
            <span className="font-bold ml-1">
              {task.metrics.profilesScreened}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-600">Submitted</span>
            <span className="font-bold ml-1">
              {task.metrics.profilesSubmitted}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-600">Accepted</span>
            <span className="font-bold ml-1">
              {task.metrics.profilesAcceptedBySales}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showMetricsForm ? (
        <form
          onSubmit={handleMetricsSubmit}
          className="space-y-2 grid grid-cols-2 gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="number"
            placeholder="Profile Sourced"
            value={metrics.profilesSourced}
            onChange={(e) =>
              setMetrics({
                ...metrics,
                profilesSourced: parseInt(e.target.value),
              })
            }
            className="w-full border rounded py-1 px-2 text-sm"
            min="0"
          />
          <input
            type="number"
            placeholder="Screened"
            value={metrics.profilesScreened}
            onChange={(e) =>
              setMetrics({
                ...metrics,
                profilesScreened: parseInt(e.target.value) || 0,
              })
            }
            className="w-full border rounded py-1 px-2 text-sm"
            min="0"
          />
          <input
            type="number"
            placeholder="Submitted"
            value={metrics.profilesSubmitted}
            onChange={(e) =>
              setMetrics({
                ...metrics,
                profilesSubmitted: parseInt(e.target.value) || 0,
              })
            }
            className="w-full border rounded py-1 px-2 text-sm"
            min="0"
          />
          <input
            type="number"
            placeholder="Accepted"
            value={metrics.profilesAcceptedBySales}
            onChange={(e) =>
              setMetrics({
                ...metrics,
                profilesAcceptedBySales: parseInt(e.target.value) || 0,
              })
            }
            className="w-full border rounded py-1 px-2 text-sm"
            min="0"
          />
          <input
            type="number"
            placeholder="To Client"
            value={metrics.profilesSubmittedToClient}
            onChange={(e) =>
              setMetrics({
                ...metrics,
                profilesSubmittedToClient: parseInt(e.target.value) || 0,
              })
            }
            className="w-full border rounded py-1 px-2 text-sm"
            min="0"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMetricsForm(false);
              }}
              className="flex-1 bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-2 ">
          <select
            value={task.status}
            onChange={(e) => {
              e.stopPropagation();
              handleStatusChange(e.target.value);
            }}
            className="w-full border rounded py-1 px-2 text-sm"
          >
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>

            <option value="Completed">Completed</option>
          </select>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMetricsForm(true);
              }}
              className="w-full bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
            >
              Update
            </button>
            <button
              className="w-full bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickView(true);
              }}
            >
              View
            </button>
            <button
              className="w-full bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700"
              onClick={onClick}
            >
              Action
            </button>
          </div>
        </div>
      )}

      <div className=" mt-4">
        <p className="text-xs text-gray-500 ">{task.assignedBy?.fullName}</p>
      </div>
      {showQuickView && (
        <TaskQuickViewModal
          task={task}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </div>
  );
};
export default TaskCard;
