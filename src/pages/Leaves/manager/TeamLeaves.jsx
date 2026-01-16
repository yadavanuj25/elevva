import { useEffect, useState } from "react";
import { useLeave } from "../../../hooks/Leaves/useLeave";
import TeamLeavesTable from "../../../components/leaves/TeamLeavesTable";
import ApproveRejectModal from "../../../components/modals/leavesModal/ApproveRejectLeave";

const TeamLeaves = () => {
  const { teamLeaves, loadTeamLeaves, approveLeave, rejectLeave, loading } =
    useLeave();

  const managerId = "MGR001";

  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    loadTeamLeaves(managerId);
  }, []);

  const handleApprove = (leave) => {
    setSelectedLeave(leave);
    setActionType("APPROVE");
  };

  const handleReject = (leave) => {
    setSelectedLeave(leave);
    setActionType("REJECT");
  };

  const handleSubmit = async (leaveId, remarks) => {
    if (actionType === "APPROVE") {
      await approveLeave(leaveId, {
        approvedBy: managerId,
        remarks,
      });
    } else {
      await rejectLeave(leaveId, {
        rejectedBy: managerId,
        remarks,
      });
    }

    setSelectedLeave(null);
    setActionType("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Team Leave Approvals</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <TeamLeavesTable
          leaves={teamLeaves}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {selectedLeave && (
        <ApproveRejectModal
          type={actionType}
          leave={selectedLeave}
          onClose={() => setSelectedLeave(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default TeamLeaves;
