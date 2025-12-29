import React, { useEffect, useState } from "react";
import { FileText, Hash, Save, X } from "lucide-react";
import { getAllUsers } from "../../services/userServices";
import { assignRequirement } from "../../services/clientServices";
import Button from "../ui/Button";
import CustomSwal from "../../utils/CustomSwal";

const AssignModal = ({
  open,
  onClose,
  selectedRequirements,
  setSelectedRows,
}) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      fetchUsers();
    }
  }, [open]);

  const closeWithAnimation = () => {
    setIsVisible(false);
    setTimeout(() => {
      resetForm();
      onClose();
    }, 1000);
  };

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers(1, 50, "active");
      setOptions(res.users);
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
    try {
      const res = await assignRequirement(payload);
      CustomSwal.fire({
        icon: "success",
        title: "Assigned Successfully",
        text: res?.message || "Requirement assigned successfully",
        confirmButtonText: "OK",
      });
      setSelectedRows([]);
      closeWithAnimation();
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
    }
  };

  const toggleUser = (id) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
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
        {/* HEADER */}
        <div className="flex items-center justify-center gap-2 bg-accent-dark text-white py-3 rounded-t-2xl relative">
          <FileText size={22} />
          <h2 className="text-lg font-semibold">Assign Requirements</h2>

          <button
            onClick={closeWithAnimation}
            className="absolute right-4 top-4 bg-white text-red-600 p-1 rounded-full"
          >
            <X size={18} />
          </button>
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
          <button
            onClick={closeWithAnimation}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
          >
            <X size={16} />
            Cancel
          </button>

          <Button
            text="Assign"
            icon={<Save size={16} />}
            handleClick={handleAssign}
          />
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
