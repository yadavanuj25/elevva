import React, { useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import SelectField from "../../ui/SelectField";
import BasicDatePicker from "../../ui/BasicDatePicker";

const RequirementStatsFilters = ({
  filters,
  setFilters,
  onSearch,
  onReset,
}) => {
  const [options, setOptions] = useState({
    statuses: [],
    experiences: [],
    budgetTypes: [],
    currencies: [],
    workModes: [],
    workRole: [],
    priorities: [],
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600 rounded-xl p-4">
      <div className="grid md:grid-cols-6 gap-4 items-center">
        <SelectField
          name="status"
          label="Status"
          value={filters.status}
          handleChange={handleChange}
          options={["Open", "In Progress", "Closed", "On Hold", "Cancelled"]}
        />

        <SelectField
          name="priority"
          label="Priority"
          value={filters.priority}
          handleChange={handleChange}
          options={["Critical", "High", "Medium", "Low"]}
        />

        <SelectField
          name="workMode"
          label="Work Mode"
          value={filters.workMode}
          handleChange={handleChange}
          options={["Remote", "On-site", "Hybrid", "Office"]}
        />

        <BasicDatePicker
          name="startDate"
          labelName="Start Date"
          value={filters.startDate}
          handleChange={handleChange}
        />

        <BasicDatePicker
          name="endDate"
          labelName="End Date"
          value={filters.endDate}
          handleChange={handleChange}
        />

        <div className=" flex justify-end gap-2">
          <button
            onClick={onSearch}
            className="p-2 bg-blue-600 text-white rounded-md"
          >
            <Search size={18} />
          </button>

          <button onClick={onReset} className="p-2 bg-gray-200 rounded-md">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequirementStatsFilters;
