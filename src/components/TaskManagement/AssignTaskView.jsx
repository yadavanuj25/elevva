import React, { useState, useEffect } from "react";
import * as yup from "yup";
import Button from "../ui/Button";
import { Save } from "lucide-react";
import PageTitle from "../../hooks/PageTitle";
import { assignTask } from "../../services/taskServices";
import SelectField from "../ui/SelectField";
import BasicDatePicker from "../ui/BasicDatePicker";
import Textareafield from "../ui/formFields/Textareafield";
import { useMessage } from "../../auth/MessageContext";
import { getAllUsers } from "../../services/userServices";
import {
  getAllRequirements,
  getRequirementOptions,
} from "../../services/clientServices";
import CustomSwal from "../../utils/CustomSwal";

const schema = yup.object().shape({
  requirementId: yup.string().required("Requirement is required"),
  assignedTo: yup.string().required("Assign To is required"),
  priority: yup.string().required("Priority is required"),
  dueDate: yup
    .string()
    .test("not-in-future", "Due Date cannot be in the past", (value) => {
      if (!value) return false;
      return (
        new Date(value) >= new Date(new Date().toISOString().split("T")[0])
      );
    })
    .required("Due Date is required"),
  notes: yup.string(),
});

const AssignTaskView = () => {
  PageTitle("Elevva | Assign Task");
  const { showSuccess, showError, errorMsg, successMsg } = useMessage();
  const [requirements, setRequirements] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    requirementId: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
    notes: "",
  });
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchRequirements();
    fetchUsers();
    fetchOptions();
  }, []);

  useEffect(() => {
    if (successMsg) {
      CustomSwal.fire({
        icon: "success",
        title: "Success",
        text: successMsg,
        confirmButtonText: "Great!",
        background: "#ffffff",
        color: "#28a745",
      });
    }
  }, [successMsg]);

  const fetchRequirements = async () => {
    try {
      const response = await getAllRequirements(1, 50, "Open");
      setRequirements(response.requirements);
    } catch (error) {
      console.error("Error fetching requirements:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers(1, 50, "active");
      setUsers(response.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchOptions = async () => {
    try {
      const res = await getRequirementOptions();
      setOptions(res?.options);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      const res = await assignTask(formData);
      setFormData({
        requirementId: "",
        assignedTo: "",
        priority: "Medium",
        dueDate: "",
        notes: "",
      });
      showSuccess(res.message);
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((error) => {
          formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      } else {
        showError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto">
      <div className="bg-white dark:bg-[#1e2738] rounded-2xl  border border-gray-300 dark:border-gray-600 p-8 transition-all">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Assign Task to HR
          </h2>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 bg-red-50 text-red-700 shadow-sm animate-slideDown">
            <span className="font-semibold">⚠ </span>
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              name="requirementId"
              label="Requirement"
              options={requirements.map((req) => ({
                value: req._id,
                label: `${req?.client?.clientName} - ${req.techStack} - ${req.requirementCode}`,
              }))}
              value={formData.requirementId}
              handleChange={handleChange}
              error={errors.requirementId}
            />

            <SelectField
              name="assignedTo"
              label="Assign To"
              options={users.map((user) => ({
                value: user._id,
                label: `${user.fullName} — ${user.email}`,
              }))}
              value={formData.assignedTo}
              handleChange={handleChange}
              error={errors.assignedTo}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              name="priority"
              label="Priority"
              options={options.priorities}
              value={formData.priority}
              handleChange={handleChange}
              error={errors.priority}
            />

            <BasicDatePicker
              name="dueDate"
              labelName="Due Date"
              value={formData.dueDate}
              handleChange={handleChange}
              errors={errors}
            />
          </div>

          <div className="col-span-2">
            <Textareafield
              name="notes"
              label="Notes"
              value={formData.notes}
              handleChange={handleChange}
            />
          </div>

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
