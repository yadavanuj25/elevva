const statusStyles = {
  PENDING: "leave-badge leave-pending",
  APPROVED: "leave-badge leave-approved",
  REJECTED: "leave-badge leave-rejected",
};

const LeaveStatusBadge = ({ status }) => {
  return <span className={statusStyles[status]}>{status}</span>;
};

export default LeaveStatusBadge;
