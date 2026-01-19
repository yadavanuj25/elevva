import React, { useState } from "react";
import RejectLeaveModal from "./RejectLeaveModal";

const ApproveReject = ({ leave, onUpdate }) => {
  const [showReject, setShowReject] = useState(false);

  return (
    <>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onUpdate(leave.id, "APPROVED")}
          className="px-3 py-1.5 text-xs font-semibold rounded-md 
          bg-green-600 text-white hover:bg-green-700"
        >
          Approve
        </button>

        <button
          onClick={() => setShowReject(true)}
          className="px-3 py-1.5 text-xs font-semibold rounded-md 
          bg-red-600 text-white hover:bg-red-700"
        >
          Reject
        </button>
      </div>

      {showReject && (
        <RejectLeaveModal
          leave={leave}
          onClose={() => setShowReject(false)}
          onReject={onUpdate}
        />
      )}
    </>
  );
};

export default ApproveReject;
