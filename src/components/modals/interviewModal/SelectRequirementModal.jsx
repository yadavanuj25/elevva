import React, { useState, useEffect, useMemo } from "react";
import { X, User } from "lucide-react";
import SelectField from "../../ui/SelectField";

const SelectRequirementModal = ({
  open,
  onClose,
  candidate,
  requirements,
  onConfirm,
}) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedRequirement, setSelectedRequirement] = useState(null);

  useEffect(() => {
    if (!open) {
      setSelectedClient("");
      setSelectedRequirement(null);
    }
  }, [open]);

  const clientOptions = useMemo(() => {
    const map = new Map();
    requirements.forEach((req) => {
      if (req.client?._id) {
        map.set(req.client._id, {
          label: req.client.clientName,
          value: req.client._id,
        });
      }
    });
    return Array.from(map.values());
  }, [requirements]);

  const requirementOptions = useMemo(() => {
    if (!selectedClient) return [];
    return requirements
      .filter((req) => req.client?._id === selectedClient)
      .map((req) => ({
        label: `${req.requirementCode} (${req.techStack})`,
        value: req._id,
        data: req,
      }));
  }, [requirements, selectedClient]);
  if (!open) return null;
  const handleRequirementChange = (e) => {
    const selected = requirementOptions.find(
      (opt) => opt.value === e.target.value
    );
    setSelectedRequirement(selected?.data || null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-xl overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl ">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 bg-accent-dark border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            Start Interview Screening
          </h3>
          <button
            onClick={onClose}
            className="bg-gray-200 text-black p-1 rounded hover:bg-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border">
            <div className="w-10 h-10 rounded-lg bg-accent-dark text-white flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Candidate
              </p>
              <p className="font-semibold capitalize text-gray-800 dark:text-white">
                {candidate?.fullName}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Client
            </div>
            <SelectField
              label=""
              value={selectedClient}
              options={clientOptions}
              handleChange={(e) => {
                setSelectedClient(e.target.value);
                setSelectedRequirement(null);
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Requirement
            </div>
            <SelectField
              label=""
              value={selectedRequirement?._id || ""}
              options={requirementOptions}
              handleChange={handleRequirementChange}
              disabled={!selectedClient}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            disabled={!selectedRequirement}
            onClick={() => onConfirm(selectedRequirement)}
            className={`px-5 py-2 rounded-lg font-medium text-white transition ${
              selectedRequirement
                ? "bg-accent-dark hover:opacity-90"
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
