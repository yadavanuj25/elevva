import React, { useEffect, useState } from "react";
import { FileText, Hash, Save, X } from "lucide-react";
import { getAllUsers } from "../../../services/userServices";
import { assignRequirement } from "../../../services/clientServices";
import Button from "../../ui/Button";
import CustomSwal from "../../../utils/CustomSwal";
import CancelButton from "../../ui/buttons/Cancel";
import Close from "../../ui/buttons/Close";

const AssignModal = ({
  open,
  onClose,
  selectedRequirements,
  setSelectedRows,
}) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      fetchUsers();
    }
  }, [open]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      resetForm();
      onClose();
    }, 1000);
  };

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers(1, 50, "active");
      setOptions(res?.users);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setSelectedOptions([]);
  };

  const handleAssign = async () => {
    if (!selectedOptions.length) {
      CustomSwal.fire({
        icon: "error",
        text: "Please select at least one user to assign",
        confirmButtonText: "OK",
      });
      return;
    }
    const payload = {
      requirementId: selectedRequirements.map((r) => r._id),
      assignedTo: selectedOptions,
    };
    setLoading(true);
    try {
      const res = await assignRequirement(payload);
      CustomSwal.fire({
        icon: "success",
        title: "Assigned Successfully",
        text: res?.message || "Requirement assigned successfully",
        confirmButtonText: "OK",
      });
      setSelectedRows([]);
      handleClose();
    } catch (err) {
      CustomSwal.fire({
        icon: "error",
        title: "Assignment Failed",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong while assigning",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (id) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
    transition-opacity duration-300
    ${isVisible ? "opacity-100" : "opacity-0"}
    bg-black/90`}
    >
      <div
        className={`w-full max-w-xl rounded-2xl shadow-xl
      bg-white dark:bg-darkBg
      transform transition-all duration-300
      ${isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
      >
        <div className="flex justify-between items-center px-5 py-3 rounded-t-2xl  bg-accent-dark border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Assign Requirements
          </h2>

          <Close handleClose={handleClose} />
        </div>

        {/* CONTENT */}
        <div
          className="p-5 space-y-4 max-h-[70vh] overflow-y-auto
      bg-gray-50 dark:bg-darkGray
      text-gray-800 dark:text-gray-200"
        >
          <p className="font-semibold text-sm">Selected Requirements</p>
          {selectedRequirements.map((req) => (
            <div
              key={req._id}
              className="flex gap-2 px-3 py-2 text-sm rounded-lg
            bg-white dark:bg-darkBg
            border border-gray-200 dark:border-gray-700"
            >
              <Hash size={14} />
              {req.requirementCode} | {req.client.clientName} | {req.techStack}
            </div>
          ))}

          <div className="mt-4">
            <p className="font-semibold mb-2 text-sm">Assign To</p>

            <div
              className="max-h-48 overflow-y-auto rounded-lg
          bg-white dark:bg-darkBg
          border border-gray-200 dark:border-gray-700"
            >
              {options.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer
                hover:bg-gray-100 dark:hover:bg-darkGray"
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(user._id)}
                    onChange={() => toggleUser(user._id)}
                  />
                  {user.fullName}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="flex justify-end gap-3 p-4 rounded-b-2xl
      bg-white dark:bg-darkBg
      border-t border-gray-200 dark:border-gray-700"
        >
          <CancelButton onClick={handleClose} />
          <Button
            text="Assign"
            icon={<Save size={16} />}
            handleClick={handleAssign}
            loading={loading}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
