import React, { useState, useEffect } from "react";
import SelectField from "../ui/SelectField";

const SelectRequirementModal = ({ open, onClose, requirements, onConfirm }) => {
  const [selectedRequirement, setSelectedRequirement] = useState(null);

  useEffect(() => {
    if (!open) {
      setSelectedRequirement(null);
    }
  }, [open]);

  if (!open) return null;

  const options = requirements.map((req) => ({
    label: `${req.requirementCode} - ${req.client.clientName} (${req.techStack})`,
    value: req._id,
    data: req,
  }));

  const handleSelectChange = (e) => {
    const selected = options.find((opt) => opt.value === e.target.value);
    setSelectedRequirement(selected?.data || null);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md flex flex-col">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Select Requirement
        </h3>

        <SelectField
          name="requirement"
          label="Select Requirement"
          value={selectedRequirement?._id || ""}
          options={options}
          handleChange={handleSelectChange}
          loading={requirements.length === 0}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            disabled={!selectedRequirement}
            onClick={() => onConfirm(selectedRequirement)}
            className={`px-4 py-2 rounded text-white ${
              selectedRequirement
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Start Screening
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectRequirementModal;
