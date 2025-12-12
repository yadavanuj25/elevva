import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { Save } from "lucide-react";
import {
  assignTask,
  getOpenRequirements,
  getUsers,
} from "../../services/taskServices";
import SearchableSelect from "../ui/SearchableSelect";

const AssignTaskView = () => {
  const [requirements, setRequirements] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    requirementId: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequirements();
    fetchUsers();
  }, []);

  const fetchRequirements = async () => {
    try {
      const response = await getOpenRequirements();
      console.log(response.requirements);
      setRequirements(response.requirements);
    } catch (error) {
      console.error("Error fetching requirements:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      requirementId: formData.requirementId,
      assignedTo: formData.assignedTo,
      priority: formData.priority,
      dueDate: formData.dueDate,
      notes: formData.notes,
    };
    try {
      await assignTask(payload);
      alert("Task assigned successfully!");
      setFormData({
        requirementId: "",
        assignedTo: "",
        priority: "Medium",
        dueDate: "",
        notes: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Error assigning task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto">
      <div className="bg-white dark:bg-[#1e2738] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-all">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Assign Task to HR
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              label="Select Requirement"
              options={requirements.map((req) => ({
                value: req._id,
                label: `${req?.client?.clientName} - ${req.techStack}  - ${req.requirementCode}`,
              }))}
              value={formData.requirementId}
              onChange={(value) =>
                setFormData({ ...formData, requirementId: value })
              }
            />

            <SearchableSelect
              label="Assign To"
              options={users.map((user) => ({
                value: user._id,
                label: `${user.fullName} — ${user.email}`,
              }))}
              value={formData.assignedTo}
              onChange={(value) =>
                setFormData({ ...formData, assignedTo: value })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              label="Priority"
              options={[
                { value: "Critical", label: "Critical" },
                { value: "High", label: "High" },
                { value: "Medium", label: "Medium" },
                { value: "Low", label: "Low" },
              ]}
              value={formData.priority}
              onChange={(value) =>
                setFormData({ ...formData, priority: value })
              }
            />

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-[#273246] text-gray-700 dark:text-gray-100 rounded-lg px-4 py-3  focus:outline-none transition"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-[#273246] text-gray-700 dark:text-gray-100 rounded-lg px-4 py-3 h-32 focus:outline-none transition"
              placeholder="Any special instructions for the HR..."
            />
          </div>

          {/* Submit */}
          <div className="col-span-2 flex justify-end">
            <Button
              type="submit"
              text="Assign"
              icon={<Save size={18} />}
              loading={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
export default AssignTaskView;
