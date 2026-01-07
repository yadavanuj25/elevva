import React, { useState, useEffect } from "react";
import CancelButton from "../../ui/buttons/Cancel";
import { X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-black/90  flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-xl overflow-hidden text-gray-800">
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-3  bg-accent-dark border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Update Interview Stage
          </h2>

          <button
            onClick={onClose}
            className="bg-gray-200 text-black p-1 rounded hover:bg-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium text-gray-600">Candidate:</span>{" "}
              <span className="capitalize text-gray-900">
                {record.profileName}
              </span>
            </p>

            <p>
              <span className="font-medium text-gray-600">Current Stage:</span>{" "}
              <span className="font-semibold text-accent-dark">
                {record.stage.replaceAll("_", " ")}
              </span>
            </p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Next Stage
            </label>

            <select
              value={nextStage}
              onChange={(e) => setNextStage(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                     focus:outline-none "
            >
              {INTERVIEW_LEVELS.map((lvl, index) => {
                const isDisabled =
                  index < currentIndex || completedStages.includes(lvl);

                return (
                  <option key={lvl} value={lvl} disabled={isDisabled}>
                    {lvl.replaceAll("_", " ")}
                    {completedStages.includes(lvl) ? " (completed)" : ""}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Remark <span className="text-gray-400">(optional)</span>
            </label>

            <textarea
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Add any notes or feedback..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                     focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
          <CancelButton onClick={onClose} />

          <button
            onClick={handleSubmit}
            disabled={!hasStageChanged}
            className={`px-5 py-2 text-sm rounded-md text-white transition ${
              hasStageChanged
                ? "bg-accent-dark hover:opacity-90"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Update Stage
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInterviewStageModal;
