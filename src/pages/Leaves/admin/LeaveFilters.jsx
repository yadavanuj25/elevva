const LeaveFilters = ({ filters, setFilters }) => {
  return (
    <div className="leave-card flex gap-4 flex-wrap">
      <input
        placeholder="Employee Name"
        className="leave-input"
        value={filters.employee}
        onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
      />

      <select
        className="leave-input"
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>
    </div>
  );
};

export default LeaveFilters;
