import LeaveStatusBadge from "./LeaveStatusBadge";

const MyLeavesTable = ({ leaves }) => {
  return (
    <div className="leave-card">
      <h3 className="leave-title">My Leaves</h3>

      <table className="leave-table">
        <thead>
          <tr>
            <th className="leave-th">Type</th>
            <th className="leave-th">From</th>
            <th className="leave-th">To</th>
            <th className="leave-th">Days</th>
            <th className="leave-th">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td className="leave-td">{leave.leaveType}</td>
              <td className="leave-td">{leave.startDate}</td>
              <td className="leave-td">{leave.endDate}</td>
              <td className="leave-td">{leave.totalDays}</td>
              <td className="leave-td">
                <LeaveStatusBadge status={leave.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyLeavesTable;
