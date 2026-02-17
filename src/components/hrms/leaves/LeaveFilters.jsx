// import React from "react";
// import { Filter } from "lucide-react";

// const LeaveFilters = ({ filters, setFilters }) => {
//   return (
//     <div className="mb-6 flex items-center space-x-4">
//       <Filter className="w-5 h-5 text-gray-400" />
//       <select
//         value={filters.status}
//         onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//         className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
//       >
//         <option value="">All Status</option>
//         <option value="pending">Pending</option>
//         <option value="approved">Approved</option>
//         <option value="rejected">Rejected</option>
//       </select>
//       <select
//         value={filters.leaveType}
//         onChange={(e) => setFilters({ ...filters, leaveType: e.target.value })}
//         className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
//       >
//         <option value="" disabled>
//           Select Leave Type
//         </option>
//         <option value="casual">Casual</option>
//         <option value="sick">Sick</option>
//         <option value="earned">Earned</option>
//       </select>
//     </div>
//   );
// };

// export default LeaveFilters;

import React from "react";
import SelectField from "../../ui/SelectField";

const LeaveFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  const leaveTypeOptions = [
    { label: "Casual", value: "casual" },
    { label: "Sick", value: "sick" },
    { label: "Earned", value: "earned" },
  ];

  return (
    <div className="w-1/2 mb-6 flex items-center gap-4 ">
      {/* <Filter className="w-5 h-5 text-gray-400" /> */}

      <div className="w-1/2">
        <SelectField
          name="status"
          label="Status"
          value={filters.status}
          options={statusOptions}
          handleChange={handleChange}
        />
      </div>

      <div className="w-1/2">
        <SelectField
          name="leaveType"
          label="Leave Type"
          value={filters.leaveType}
          options={leaveTypeOptions}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};

export default LeaveFilters;
