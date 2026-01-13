import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";

import Input from "../../components/ui/Input";
import SelectField from "../../components/ui/SelectField";
import BasicDatePicker from "../../components/ui/BasicDatePicker";
import Textareafield from "../../components/ui/formFields/Textareafield";
import Button from "../../components/ui/Button";
import CancelButton from "../../components/ui/buttons/Cancel";
import { useAuth } from "../../auth/AuthContext";
import { leaveSchema } from "../../components/attendance/validation/leaveSchema";

import {
  getLeaveTypes,
  getLeaveDurations,
  submitLeave,
} from "../../services/leaveService";

const LeaveApplication = () => {
  const { user } = useAuth();

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveDurations, setLeaveDurations] = useState([]);

  const [form, setForm] = useState({
    leaveType: "",
    leaveDuration: "Full Day",
    fromDate: "",
    toDate: "",
    totalDays: 0,
    reason: "",
    contactNumber: "",
    attachment: null,
  });

  const [errors, setErrors] = useState({});

  /* ---------------- Load dropdown data (JSON now, API later) ---------------- */
  useEffect(() => {
    const loadData = async () => {
      setLeaveTypes(await getLeaveTypes());
      setLeaveDurations(await getLeaveDurations());
    };
    loadData();
  }, []);

  /* ---------------- Auto calculate total days ---------------- */
  useEffect(() => {
    if (form.fromDate && form.toDate) {
      const start = new Date(form.fromDate);
      const end = new Date(form.toDate);
      const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

      setForm((p) => ({
        ...p,
        totalDays: form.leaveDuration === "Half Day" ? 0.5 : diff,
      }));
    }
  }, [form.fromDate, form.toDate, form.leaveDuration]);

  /* ---------------- Handlers ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setForm((p) => ({ ...p, attachment: file }));
    setErrors((p) => ({ ...p, attachment: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveSchema.validate(form, { abortEarly: false });
      setErrors({});

      const payload = {
        ...form,
        employeeId: user.id,
        status: "Pending",
      };

      await submitLeave(payload);
      console.log("Leave submitted successfully", payload);
    } catch (err) {
      const temp = {};
      err.inner?.forEach((e) => (temp[e.path] = e.message));
      setErrors(temp);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1">Apply Leave</h2>
      <p className="text-sm text-gray-500 mb-4">
        Leave request will be sent to your reporting manager
      </p>

      <form
        className="bg-white dark:bg-gray-800 p-5 rounded-lg space-y-5 border"
        onSubmit={handleSubmit}
      >
        {/* Employee Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input labelName="Employee Name" value={user?.fullName} readOnly />
          <Input labelName="Job Role" value={user?.role?.name} readOnly />
        </div>

        {/* Leave Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectField
            name="leaveType"
            label="Leave Type"
            value={form.leaveType}
            options={leaveTypes.map((l) => l.label)}
            handleChange={handleChange}
            error={errors.leaveType}
          />

          <SelectField
            name="leaveDuration"
            label="Leave Duration"
            value={form.leaveDuration}
            options={leaveDurations.map((d) => d.label)}
            handleChange={handleChange}
            error={errors.leaveDuration}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <BasicDatePicker
            name="fromDate"
            labelName="From Date"
            value={form.fromDate}
            handleChange={handleChange}
            errors={errors}
          />
          <BasicDatePicker
            name="toDate"
            labelName="To Date"
            value={form.toDate}
            handleChange={handleChange}
            errors={errors}
          />
        </div>

        {/* Auto Calculated */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input labelName="Total Days" value={form.totalDays} readOnly />
          <Input
            name="contactNumber"
            labelName="Contact During Leave (Optional)"
            value={form.contactNumber}
            handleChange={handleChange}
          />
        </div>

        {/* Reason */}
        <Textareafield
          name="reason"
          label="Reason for Leave"
          value={form.reason}
          handleChange={handleChange}
          error={errors.reason}
        />

        {/* Attachment */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Attachment (Optional)
          </label>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full text-sm border rounded-md p-2
              dark:bg-gray-700 dark:border-gray-600"
          />

          <p className="text-xs text-gray-500 mt-1">
            Upload medical certificate or supporting document (PDF, JPG, PNG —
            Max 5MB)
          </p>

          {errors.attachment && (
            <p className="text-xs text-red-500 mt-1">{errors.attachment}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <CancelButton />
          <Button type="submit" text="Submit" icon={<Save size={18} />} />
        </div>
      </form>
    </div>
  );
};

export default LeaveApplication;
