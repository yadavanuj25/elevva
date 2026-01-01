import React, { useState, useEffect } from "react";

const INTERVIEW_LEVELS = [
  "BDE_SCREENING",
  "CLIENT_L1",
  "CLIENT_L2",
  "CLIENT_L3",
  "HR_ROUND",
  "OFFERED",
  "REJECTED",
];

const UpdateInterviewStageModal = ({ open, record, onClose, onUpdate }) => {
  const [nextStage, setNextStage] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    if (record) {
      setNextStage(record.stage);
      setRemark("");
    }
  }, [record]);
  if (!open || !record) return null;
  const currentIndex = INTERVIEW_LEVELS.indexOf(record.stage);
  const completedStages = record.history?.map((h) => h.to) || [];
  const hasStageChanged =
    nextStage !== record.stage && !completedStages.includes(nextStage);

  const handleSubmit = () => {
    if (!hasStageChanged) return;
    onUpdate({
      nextStage,
      remark: remark.trim() || null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Update Interview Stage</h2>

        <div className="space-y-3 text-sm">
          <p>
            <strong>Candidate:</strong> {record.profileName}
          </p>

          <p>
            <strong>Current Stage:</strong>{" "}
            <span className="text-blue-600">
              {record.stage.replaceAll("_", " ")}
            </span>
          </p>

          {/* STAGE SELECT */}
          <div>
            <label className="block mb-1 font-medium">Next Stage</label>
            <select
              className="w-full border rounded p-2"
              value={nextStage}
              onChange={(e) => setNextStage(e.target.value)}
            >
              {INTERVIEW_LEVELS.map((lvl, index) => {
                const isDisabled =
                  index < currentIndex || completedStages.includes(lvl);
                return (
                  <option key={lvl} value={lvl} disabled={isDisabled}>
                    {lvl.replaceAll("_", " ")}
                    {completedStages.includes(lvl) ? " (done)" : ""}
                  </option>
                );
              })}
            </select>
          </div>

          {/* REMARK (OPTIONAL) */}
          <div>
            <label className="block mb-1 font-medium">
              Remark <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              placeholder="Add any notes (optional)..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 text-sm border rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className={`px-4 py-2 text-sm rounded text-white transition ${
              hasStageChanged
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
            disabled={!hasStageChanged}
          >
            Update Stage
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInterviewStageModal;
