import React, { useState, useEffect, useMemo } from "react";
import { X, User } from "lucide-react";
import SelectField from "../../ui/SelectField";
import {
  getAllClients,
  getRequirementByClientId,
} from "../../../services/clientServices";
import Close from "../../ui/buttons/Close";

const SelectRequirementModal = ({
  open,
  onClose,
  candidate,
  handleScreening,
}) => {
  const [clients, setClients] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [loadingReq, setLoadingReq] = useState(false);
  const [loadingClient, setLoadingClient] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedClient("");
      setSelectedRequirement(null);
    }
  }, [open]);

  useEffect(() => {
    if (open) fetchClients();
  }, [open]);

  useEffect(() => {
    if (selectedClient) {
      fetchRequirements();
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    setLoadingClient(true);
    try {
      const res = await getAllClients();
      setClients(res.clients || []);
    } catch (error) {
      console.error("Failed to fetch clients", error);
    } finally {
      setLoadingClient(false);
    }
  };
  const clientOptions = useMemo(() => {
    return clients.map((client) => ({
      label: client.clientName,
      value: client._id,
    }));
  }, [clients]);

  const fetchRequirements = async () => {
    setLoadingReq(true);
    try {
      const response = await getRequirementByClientId(selectedClient);
      const allRequirements = response.requirements || [];
      const openRequirements = allRequirements.filter(
        (req) => req.positionStatus === "Open",
      );
      setRequirements(openRequirements);
    } catch (error) {
      console.error("Requirement fetch error", error);
    } finally {
      setLoadingReq(false);
    }
  };
  const requirementOptions = useMemo(() => {
    if (!selectedClient) return [];
    return requirements.map((req) => ({
      label: `${req.requirementCode} (${req.techStack})`,
      value: req._id,
      data: req,
    }));
  }, [requirements, selectedClient]);

  const handleRequirementChange = (e) => {
    const selected = requirementOptions.find(
      (opt) => opt.value === e.target.value,
    );
    if (!selected) return;
    const clientObj = clients.find((c) => c._id === selectedClient);
    const requirementWithClientName = {
      ...selected.data,
      clientName: clientObj?.clientName || "Unknown",
    };
    setSelectedRequirement(requirementWithClientName);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-xl  bg-white dark:bg-gray-800 rounded-2xl shadow-xl ">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 rounded-t-2xl bg-accent-dark border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            Start Interview Screening
          </h3>
          {/* <button
            onClick={onClose}
            className="bg-gray-200 text-black p-1 rounded hover:bg-gray-400"
          >
            <X size={18} />
          </button> */}
          <Close handleClose={onClose} />
        </div>

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
              loading={loadingClient}
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
              loading={loadingReq}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            disabled={!selectedRequirement}
            onClick={() => handleScreening(selectedRequirement)}
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
