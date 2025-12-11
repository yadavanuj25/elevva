import React, { useState } from "react";
import MetricCard from "../TaskManagement/MetricCard";
import { addTaskFeedback, addTaskRejection } from "../../services/taskServices";

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
      alert("Please enter feedback");
      return;
    }
    const payload = {
      message: feedback,
      type: feedbackType,
    };
    try {
      await addTaskFeedback(task._id, payload);
      alert("Feedback added successfully!");
      setFeedback("");
      onRefresh();
    } catch (error) {
      alert("Error adding feedback");
    }
  };

  const handleAddRejection = async () => {
    if (!rejection.candidateName || !rejection.reason) {
      alert("Please fill all rejection fields");
      return;
    }
    const payload = {
      candidateName: rejection.candidateName,
      reason: rejection.reason,
      rejectedBy: rejection.rejectedBy,
      stage: rejection.stage,
    };
    try {
      await addTaskRejection(task._id, payload);
      alert("Rejection recorded successfully!");
      setRejection({
        candidateName: "",
        rejectedBy: "Sales",
        reason: "",
        stage: "Sales Review",
      });
      onRefresh();
    } catch (error) {
      alert("Error recording rejection");
    }
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
export default TaskDetailModal;
