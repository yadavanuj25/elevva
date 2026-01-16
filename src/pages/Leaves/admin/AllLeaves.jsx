import { useState } from "react";
import { adminLeaves } from "../../../contstants/leaves/adminLeaves";
import LeaveTable from "../../../components/leaves/LeaveTable";
import LeaveFilters from "./LeaveFilters";

const AllLeaves = () => {
  const [filters, setFilters] = useState({
    employee: "",
    status: "",
  });

  const filteredLeaves = adminLeaves.filter((l) => {
    return (
      (!filters.employee ||
        l.employeeName
          .toLowerCase()
          .includes(filters.employee.toLowerCase())) &&
      (!filters.status || l.status === filters.status)
    );
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">All Employee Leaves</h2>
      <LeaveFilters filters={filters} setFilters={setFilters} />
      <LeaveTable leaves={filteredLeaves} showActions={true} />
    </div>
  );
};

export default AllLeaves;
