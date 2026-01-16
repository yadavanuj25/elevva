import { useState } from "react";

const ApproveRejectModal = ({ type, leave, onClose, onSubmit }) => {
  const [remarks, setRemarks] = useState("");

  return (
    <div className="leave-modal-overlay">
      <div className="leave-modal">
        <h3 className="leave-modal-title">
          {type === "APPROVE" ? "Approve Leave" : "Reject Leave"}
        </h3>

        <p className="text-sm text-gray-600 mb-3">
          {leave.employeeName} | {leave.leaveType} | {leave.startDate} →{" "}
          {leave.endDate}
        </p>

        <textarea
          rows="3"
          placeholder="Remarks (optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="leave-textarea"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button className="leave-btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button
            className={
              type === "APPROVE" ? "leave-btn-approve" : "leave-btn-reject"
            }
            onClick={() => onSubmit(leave.id, remarks)}
          >
            {type === "APPROVE" ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveRejectModal;
