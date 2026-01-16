import LeaveStatusBadge from "./LeaveStatusBadge";

const LeaveTable = ({ leaves, showActions, onApprove, onReject }) => {
  return (
    <div className="leave-card">
      <table className="leave-table">
        <thead>
          <tr>
            <th className="leave-th">Employee</th>
            <th className="leave-th">Type</th>
            <th className="leave-th">From</th>
            <th className="leave-th">To</th>
            <th className="leave-th">Days</th>
            <th className="leave-th">Status</th>
            <th className="leave-th">Approved By</th>
            {showActions && <th className="leave-th">Action</th>}
          </tr>
        </thead>

        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td className="leave-td">{leave.employeeName}</td>
              <td className="leave-td">{leave.leaveType}</td>
              <td className="leave-td">{leave.startDate}</td>
              <td className="leave-td">{leave.endDate}</td>
              <td className="leave-td">{leave.totalDays}</td>
              <td className="leave-td">
                <LeaveStatusBadge status={leave.status} />
              </td>
              <td className="leave-td">{leave.approvedBy || "-"}</td>

              {showActions && leave.status === "PENDING" && (
                <td className="leave-td">
                  <div className="flex gap-2">
                    <button
                      className="leave-btn-approve"
                      onClick={() => onApprove(leave)}
                    >
                      Approve
                    </button>
                    <button
                      className="leave-btn-reject"
                      onClick={() => onReject(leave)}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;
