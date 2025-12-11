import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { Save } from "lucide-react";
import {
  assignTask,
  getOpenRequirements,
  getUsers,
} from "../../services/taskServices";

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
            {/* Requirement */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Select Requirement <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.requirementId}
                onChange={(e) =>
                  setFormData({ ...formData, requirementId: e.target.value })
                }
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-[#273246] text-gray-700 dark:text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              >
                <option value="">Select a requirement</option>
                {requirements.map((req) => (
                  <option key={req._id} value={req._id}>
                    {req.requirementCode} - {req.techStack} (
                    {req?.client?.clientName})
                  </option>
                ))}
              </select>
            </div>

            {/* Assign To */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Assign To <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-[#273246] text-gray-700 dark:text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName} — {user.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-[#273246] text-gray-700 dark:text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

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
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-[#273246] text-gray-700 dark:text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 transition"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Notes / Instructions
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-[#273246] text-gray-700 dark:text-gray-100 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-blue-500 transition"
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
