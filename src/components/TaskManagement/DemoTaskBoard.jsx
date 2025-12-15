import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { Copy } from "lucide-react";

const API_URL = "https://crm-backend-qbz0.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Main App Component
const MyTaskDashboard = () => {
  const [currentView, setCurrentView] = useState("my-tasks");
  const [userRole, setUserRole] = useState("hr");

  useEffect(() => {
    // Check user role from localStorage or API
    const role = localStorage.getItem("userRole") || "hr";
    setUserRole(role);
  }, []);

  return (
    <div className="min-h-screen ">
      {/* Navigation */}
      <nav className="bg-white dark:bg-[#31415f] rounded-lg mb-6">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-dark">Task Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView("my-tasks")}
                className={`px-4 py-2 rounded-lg ${
                  currentView === "my-tasks"
                    ? "bg-dark text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                My Tasks
              </button>
              {/* {userRole === "manager" && ( */}
              <>
                <button
                  onClick={() => setCurrentView("all-tasks")}
                  className={`px-4 py-2 rounded-lg ${
                    currentView === "all-tasks"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Tasks
                </button>
                <button
                  onClick={() => setCurrentView("assign-task")}
                  className={`px-4 py-2 rounded-lg ${
                    currentView === "assign-task"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Assign Task
                </button>
                <button
                  onClick={() => setCurrentView("report")}
                  className={`px-4 py-2 rounded-lg ${
                    currentView === "report"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Reports
                </button>
              </>
              {/* )} */}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className=" ">
        {currentView === "my-tasks" && <MyTasksDashboard />}
        {currentView === "all-tasks" && <AllTasksView />}
        {currentView === "assign-task" && <AssignTaskView />}
        {currentView === "report" && <TaskReportView />}
      </div>
    </div>
  );
};

// My Tasks Dashboard Component
const MyTasksDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        "https://crm-backend-qbz0.onrender.com/api/tasks/my-tasks"
      );
      setTasks(response.data.tasks);
      setGroupedTasks(response.data.groupedTasks);
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total Tasks" count={summary.total} color="blue" />
        <SummaryCard title="Assigned" count={summary.assigned} color="yellow" />
        <SummaryCard
          title="In Progress"
          count={summary.inProgress}
          color="purple"
        />
        <SummaryCard
          title="Completed"
          count={summary.completed}
          color="green"
        />
      </div>

      {/* Task Columns (Kanban Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskColumn
          title="Assigned"
          tasks={groupedTasks.assigned || []}
          color="yellow"
          onTaskClick={setSelectedTask}
          onRefresh={fetchMyTasks}
        />
        <TaskColumn
          title="In Progress"
          tasks={groupedTasks.inProgress || []}
          color="blue"
          onTaskClick={setSelectedTask}
          onRefresh={fetchMyTasks}
        />
        <TaskColumn
          title="Completed"
          tasks={groupedTasks.completed || []}
          color="green"
          onTaskClick={setSelectedTask}
          onRefresh={fetchMyTasks}
        />
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onRefresh={fetchMyTasks}
        />
      )}
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ title, count, color }) => {
  const colors = {
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
  };

  return (
    <div className={`${colors[color]} rounded-lg p-6 text-white shadow-lg`}>
      <div className="text-sm font-medium opacity-90">{title}</div>
      <div className="text-4xl font-bold mt-2">{count || 0}</div>
    </div>
  );
};

// Task Column Component
const TaskColumn = ({ title, tasks, color, onTaskClick, onRefresh }) => {
  const colors = {
    yellow: "border-yellow-500",
    blue: "border-blue-500",
    green: "border-green-500",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className={`text-lg font-bold mb-4 border-l-4 ${colors[color]} pl-3`}>
        {title} ({tasks.length})
      </h3>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tasks</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => onTaskClick(task)}
              onRefresh={onRefresh}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task, onClick, onRefresh }) => {
  const [showMetricsForm, setShowMetricsForm] = useState(false);
  const [metrics, setMetrics] = useState(task.metrics);
  const [showQuickView, setShowQuickView] = useState(false);

  const priorityColors = {
    Critical: "bg-red-100 text-red-800 border-red-300",
    High: "bg-orange-100 text-orange-800 border-orange-300",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Low: "bg-green-100 text-green-800 border-green-300",
  };

  const handleMetricsSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tasks/${task._id}/metrics`, metrics);

      setShowMetricsForm(false);
      onRefresh();
    } catch (error) {}
  };

  const handleStatusChange = async (status) => {
    try {
      await api.put(`/tasks/${task._id}/status`, { status });

      onRefresh();
    } catch (error) {}
  };

  return (
    <div
      className={`border-2 ${
        priorityColors[task.priority]
      } rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-mono text-gray-600">{task.taskCode}</span>
        <span
          className={`text-xs px-2 py-1 rounded ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      {/* <h4 className="font-bold text-gray-800 mb-1" onClick={onClick}>
        {task.requirement?.workRole}
      </h4> */}
      <p className="text-sm text-gray-600 mb-2" onClick={onClick}>
        {task.requirement?.client?.clientName}
      </p>
      <p className="text-xs text-gray-500 mb-3">
        {task.requirement?.techStack}
      </p>
      <p className="text-xs text-gray-500 mb-3">
        {task.requirement?.requirementCode}
      </p>

      {/* Metrics */}
      <div className="bg-gray-50 rounded p-2 mb-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-gray-600">Sourced:</span>
            <span className="font-bold ml-1">
              {task.metrics.profilesSourced}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Screened:</span>
            <span className="font-bold ml-1">
              {task.metrics.profilesScreened}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Submitted:</span>
            <span className="font-bold ml-1">
              {task.metrics.profilesSubmitted}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Accepted:</span>
            <span className="font-bold ml-1">
              {task.metrics.profilesAcceptedBySales}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {!showMetricsForm ? (
        <div className="space-y-2 ">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMetricsForm(true);
              }}
              className="w-full bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
            >
              Update Metrics
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
          </div>
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
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      ) : (
        <form
          onSubmit={handleMetricsSubmit}
          className="space-y-2"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="number"
            placeholder="Sourced"
            value={metrics.profilesSourced}
            onChange={(e) =>
              setMetrics({
                ...metrics,
                profilesSourced: parseInt(e.target.value) || 0,
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
      )}

      <div className=" mt-4">
        <p className="text-xs text-gray-500 mb-3">
          {task.assignedBy?.fullName}
        </p>
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

// Task Detail Modal Component
const TaskDetailModal = ({ task, onClose, onRefresh }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("General");
  const [rejection, setRejection] = useState({
    candidateName: "",
    rejectedBy: "Sales",
    reason: "",
    stage: "Sales Review",
  });

  const handleAddFeedback = async () => {
    if (!feedback.trim()) {
      return;
    }
    try {
      await api.post(`/tasks/${task._id}/feedback`, {
        message: feedback,
        type: feedbackType,
      });

      setFeedback("");
      onRefresh();
    } catch (error) {}
  };

  const handleAddRejection = async () => {
    if (!rejection.candidateName || !rejection.reason) {
      return;
    }
    try {
      await api.post(`/tasks/${task._id}/rejection`, rejection);

      setRejection({
        candidateName: "",
        rejectedBy: "Sales",
        reason: "",
        stage: "Sales Review",
      });
      onRefresh();
    } catch (error) {}
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{task.taskCode}</h2>
              <p className="text-blue-100 mt-1">{task.requirement?.workRole}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-4 px-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-3 px-4 ${
                activeTab === "details"
                  ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : "text-gray-600"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("feedback")}
              className={`py-3 px-4 ${
                activeTab === "feedback"
                  ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : "text-gray-600"
              }`}
            >
              Feedback
            </button>
            <button
              onClick={() => setActiveTab("rejections")}
              className={`py-3 px-4 ${
                activeTab === "rejections"
                  ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : "text-gray-600"
              }`}
            >
              Rejections
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Client</label>
                  <p className="font-medium">
                    {task.requirement?.client?.clientName}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Requirement Code
                  </label>
                  <p className="font-medium">
                    {task.requirement?.requirementCode}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Priority</label>
                  <p className="font-medium">{task.priority}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <p className="font-medium">{task.status}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-lg mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <MetricCard
                    label="Profiles Sourced"
                    value={task.metrics.profilesSourced}
                  />
                  <MetricCard
                    label="Profiles Screened"
                    value={task.metrics.profilesScreened}
                  />
                  <MetricCard
                    label="Profiles Submitted"
                    value={task.metrics.profilesSubmitted}
                  />
                  <MetricCard
                    label="Accepted by Sales"
                    value={task.metrics.profilesAcceptedBySales}
                  />
                  <MetricCard
                    label="Submitted to Client"
                    value={task.metrics.profilesSubmittedToClient}
                  />
                  <MetricCard
                    label="Success Rate"
                    value={`${task.successRate || 0}%`}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="space-y-4">
              <div className="space-y-3">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your feedback..."
                  className="w-full border rounded p-3 h-32"
                />
                <div className="flex gap-3">
                  <select
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    className="border rounded px-3 py-2"
                  >
                    <option value="General">General</option>
                    <option value="Sales">Sales</option>
                    <option value="Client">Client</option>
                    <option value="Internal">Internal</option>
                  </select>
                  <button
                    onClick={handleAddFeedback}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Add Feedback
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold mb-3">Previous Feedback</h3>
                <div className="space-y-3">
                  {task.feedback?.length === 0 ? (
                    <p className="text-gray-500">No feedback yet</p>
                  ) : (
                    task.feedback?.map((fb, idx) => (
                      <div key={idx} className="border rounded p-3 bg-gray-50">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">
                            {fb.user?.fullName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(fb.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{fb.message}</p>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-2 inline-block">
                          {fb.type}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "rejections" && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <h3 className="font-bold mb-3">Record Rejection</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Candidate Name"
                    value={rejection.candidateName}
                    onChange={(e) =>
                      setRejection({
                        ...rejection,
                        candidateName: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={rejection.rejectedBy}
                      onChange={(e) =>
                        setRejection({
                          ...rejection,
                          rejectedBy: e.target.value,
                        })
                      }
                      className="border rounded px-3 py-2"
                    >
                      <option value="HR">HR</option>
                      <option value="Sales">Sales</option>
                      <option value="Client">Client</option>
                    </select>
                    <select
                      value={rejection.stage}
                      onChange={(e) =>
                        setRejection({ ...rejection, stage: e.target.value })
                      }
                      className="border rounded px-3 py-2"
                    >
                      <option value="Screening">Screening</option>
                      <option value="Sales Review">Sales Review</option>
                      <option value="Client Submission">
                        Client Submission
                      </option>
                      <option value="Interview">Interview</option>
                      <option value="Final Round">Final Round</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Rejection Reason (Required)"
                    value={rejection.reason}
                    onChange={(e) =>
                      setRejection({ ...rejection, reason: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 h-24"
                  />
                  <button
                    onClick={handleAddRejection}
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                  >
                    Record Rejection
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold mb-3">Rejection History</h3>
                <div className="space-y-3">
                  {task.rejections?.length === 0 ? (
                    <p className="text-gray-500">No rejections recorded</p>
                  ) : (
                    task.rejections?.map((rej, idx) => (
                      <div
                        key={idx}
                        className="border border-red-200 rounded p-3 bg-red-50"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">
                            {rej.candidateName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(rej.rejectedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm mb-2">
                          <span className="text-gray-600">Rejected by:</span>{" "}
                          <strong>{rej.rejectedBy}</strong> at{" "}
                          <strong>{rej.stage}</strong>
                        </div>
                        <p className="text-sm text-gray-700 bg-white p-2 rounded">
                          {rej.reason}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TaskQuickViewModal = ({ task, onClose }) => {
  const [copied, setCopied] = useState(false);
  const jobDescRef = useRef(null);

  const sanitizedJobDesc = DOMPurify.sanitize(
    task.requirement?.jobDescription || ""
  );

  const copyJobDescription = () => {
    const visibleText = jobDescRef.current?.innerText || "";
    navigator.clipboard.writeText(visibleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="bg-blue-600 text-white p-5 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">
                {task.requirement?.client?.clientName} -{" "}
                {task.requirement?.techStack}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="text-white text-2xl hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-5">
            <Detail
              label="Client"
              value={task.requirement?.client?.clientName}
            />
            <Detail
              label="Requirement Code"
              value={task.requirement?.requirementCode}
            />
            <Detail label="Created By" value={task.requirement?.createdBy} />
            <Detail
              label="Position Status"
              value={task.requirement?.positionStatus}
            />
            <Detail label="Work Mode" value={task.requirement?.workMode} />
            <Detail label="Location" value={task.requirement?.workLocation} />
            <Detail label="Experience" value={task.requirement?.experience} />
            <Detail
              label="Total Positions"
              value={task.requirement?.totalPositions}
            />
            <Detail
              label="Budget Details"
              value={`${task.requirement?.budgetType} - ${task.requirement?.currency}  - ${task.requirement?.budget}`}
            />
            <Detail label="Priority" value={task.priority} />
            <Detail label="Status" value={task.status} />
          </div>

          {/* Job Description Full Width */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-gray-600">Job Description</p>

              <button
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                onClick={copyJobDescription}
              >
                <Copy size={16} />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            <p
              ref={jobDescRef}
              className="p-3 rounded border text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizedJobDesc }}
            >
              {/* {task.requirement?.jobDescription} */}
              {/* {plainJobDescription} */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-600">{label}</p>
    <p className="font-medium text-gray-900 mt-0.5">{value || "-"}</p>
  </div>
);

const MetricCard = ({ label, value }) => (
  <div className="bg-gray-50 rounded p-3 text-center">
    <p className="text-2xl font-bold text-blue-600">{value}</p>
    <p className="text-xs text-gray-600 mt-1">{label}</p>
  </div>
);

// All Tasks View (Manager)

const AllTasksView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);

      const response = await api.get(
        `https://crm-backend-qbz0.onrender.com/api/tasks?${params.toString()}`
      );

      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch again when filters change
  useEffect(() => {
    fetchAllTasks();
  }, [filters]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">All Tasks</h2>

        <div className="flex gap-4 flex-wrap">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border rounded px-4 py-2"
          >
            <option value="">All Status</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
            className="border rounded px-4 py-2"
          >
            <option value="">All Priority</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* ---------- Card Layout Integration ---------- */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tasks.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10">
            No Tasks Found
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="
    group
    bg-white/70 backdrop-blur-xl
    rounded-2xl 
    border border-gray-200
    shadow-sm 
    hover:shadow-xl 
   
    transition-all duration-300
    p-6
    relative
  "
            >
              {/* Elegant Top Bar */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
                    {task.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    #{task._id.substring(0, 6)}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full
        ${
          task.status === "Completed"
            ? "bg-green-100 text-green-700 border border-green-300"
            : task.status === "In Progress"
            ? "bg-blue-100 text-blue-700 border border-blue-300"
            : task.status === "Assigned"
            ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
            : "bg-gray-100 text-gray-700 border border-gray-300"
        }
      `}
                >
                  {task.status}
                </span>
              </div>

              {/* Category & Deadline */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">Category:</span>
                  {task.category?.name || "N/A"}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">Deadline:</span>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "—"}
                </div>

                {/* Priority */}
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold
          ${
            task.priority === "High"
              ? "bg-red-100 text-red-700 border border-red-300"
              : task.priority === "Medium"
              ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }
      `}
                  >
                    Priority: {task.priority}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-semibold text-gray-800">
                    {task.overall_progress || 0}%
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                    style={{ width: `${task.overall_progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Stats Boxes */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white/50 border border-gray-200 rounded-xl p-4 shadow-inner text-center">
                  <p className="text-xs text-gray-500">Datasets</p>
                  <p className="text-lg font-bold text-gray-900">
                    {task.datasets_uploaded_count || 0} /{" "}
                    {task.total_datasets || 0}
                  </p>
                </div>

                <div className="bg-white/50 border border-gray-200 rounded-xl p-4 shadow-inner text-center">
                  <p className="text-xs text-gray-500">Subtasks</p>
                  <p className="text-lg font-bold text-gray-900">
                    {task.subtasks_completed || 0} / {task.total_subtasks || 0}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow">
                  View
                </button>

                <button className="flex-1 bg-yellow-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-yellow-600 transition shadow">
                  Edit
                </button>

                <button className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition shadow">
                  Feedback
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyTaskDashboard;
