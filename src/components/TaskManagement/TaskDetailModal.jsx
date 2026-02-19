import React, { useState, useEffect } from "react";
import MetricCard from "../TaskManagement/MetricCard";
import { addTaskFeedback, addTaskRejection } from "../../services/taskServices";
import { Save, X } from "lucide-react";
import Detail from "./Detail";
import Button from "../ui/Button";
import Close from "../ui/buttons/Close";
import { toastError, toastSuccess } from "../../utils/toaster/toastHelpers";

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
  const [visible, setVisible] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [loadingRejection, setLoadingRejection] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleAddFeedback = async () => {
    if (!feedback.trim()) {
      return;
    }
    const payload = {
      message: feedback,
      type: feedbackType,
    };
    setLoadingFeedback(true);
    try {
      const res = await addTaskFeedback(task._id, payload);
      setFeedback("");
      onRefresh();
      handleClose();
      toastSuccess(res.message);
    } catch (error) {
      toastError(error.message);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleAddRejection = async () => {
    if (!rejection.candidateName || !rejection.reason) {
      return;
    }
    const payload = {
      candidateName: rejection.candidateName,
      reason: rejection.reason,
      rejectedBy: rejection.rejectedBy,
      stage: rejection.stage,
    };
    setLoadingRejection(true);
    try {
      const res = await addTaskRejection(task._id, payload);
      setRejection({
        candidateName: "",
        rejectedBy: "Sales",
        reason: "",
        stage: "Sales Review",
      });
      onRefresh();
      handleClose();
      toastSuccess(res.message);
    } catch (error) {
      toastError(error.message);
    } finally {
      setLoadingRejection(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4
        transition-opacity duration-200
        ${visible ? "opacity-100" : "opacity-0"}
        bg-black/80 bg-opacity-90`}
    >
      <div
        className={`bg-white   rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto
          transform transition-all duration-200
          ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <div className="bg-accent-dark text-white px-5 py-3 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">{task?.taskCode}</h2>-{" "}
              <p>{task?.requirement?.techStack}</p>
            </div>

            <Close handleClose={handleClose} />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-4 px-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-3 px-4 ${
                activeTab === "details"
                  ? "border-b-2 border-accent-dark text-accent-dark font-medium"
                  : "text-gray-600"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("feedback")}
              className={`py-3 px-4 ${
                activeTab === "feedback"
                  ? "border-b-2 border-accent-dark text-accent-dark font-medium"
                  : "text-gray-600"
              }`}
            >
              Feedback
            </button>
            <button
              onClick={() => setActiveTab("rejections")}
              className={`py-3 px-4 ${
                activeTab === "rejections"
                  ? "border-b-2 border-accent-dark text-accent-dark font-medium"
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
                <Detail
                  label="Client"
                  value={task.requirement?.client?.clientName}
                />
                <Detail
                  label="Requirement Code"
                  value={task.requirement?.requirementCode}
                />
                <Detail label="Priority" value={task.priority} />
                <Detail label="Status" value={task.status} />
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
                  className="w-full text-black border border-[#E8E8E9] rounded p-3 h-32"
                />
                <div className=" w-full flex items-center justify-between">
                  <div className="w-1/2">
                    <select
                      value={feedbackType}
                      onChange={(e) => setFeedbackType(e.target.value)}
                      className="text-black border border-[#E8E8E9]  rounded px-3 py-2"
                    >
                      <option value="General">General</option>
                      <option value="Sales">Sales</option>
                      <option value="Client">Client</option>
                      <option value="Internal">Internal</option>
                    </select>
                  </div>

                  <Button
                    type="button"
                    text="Add Feedback"
                    icon={<Save size={18} />}
                    handleClick={handleAddFeedback}
                    loading={loadingFeedback}
                    disabled={loadingFeedback}
                  />
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
                        <span className="text-xs bg-accent-light text-accent-dark px-2 py-1 rounded mt-2 inline-block">
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
            <div className="space-y-4 text-black">
              <div className="bg-yellow-50 border border-yellow-400 rounded p-4">
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

                  <Button
                    type="button"
                    text="Record Rejection"
                    icon={<Save size={18} />}
                    handleClick={handleAddRejection}
                    loading={loadingRejection}
                    disabled={loadingRejection}
                  />
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
