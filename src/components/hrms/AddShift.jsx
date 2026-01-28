import React, { useState, useEffect } from "react";
import { Check, Save } from "lucide-react";
import * as yup from "yup";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import CancelButton from "../ui/buttons/Cancel";
import Button from "../ui/Button";
import { IoCheckmarkCircle } from "react-icons/io5";
import { createShift } from "../../services/hrmsServices";
import BackButton from "../ui/buttons/BackButton";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../auth/MessageContext";
import ErrorMessage from "../modals/errors/ErrorMessage";
const shiftSchema = yup.object({
  name: yup.string().required("Shift name is required"),
  timezone: yup.string().required("Timezone is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  workingDays: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one working day")
    .required("Working days are required"),
  breakTime: yup.object({
    duration: yup
      .number()
      .typeError("Break duration must be a number")
      .required("Break duration is required")
      .min(30, "Break duration must be at least 30 minutes"),
    isPaid: yup.boolean().notRequired(),
  }),
  graceTime: yup
    .number()
    .typeError("Grace time must be a number")
    .min(0, "Grace time cannot be negative")
    .required("Grace time is required"),
  halfDayHours: yup
    .number()
    .typeError("Half day hours must be a number")
    .required("Half day hours is required")
    .moreThan(0, "Half day hours must be greater than 0"),
  fullDayHours: yup
    .number()
    .typeError("Full day hours must be a number")
    .required("Full day hours is required")
    .moreThan(0, "Full day hours must be greater than 0"),
  overtimeEnabled: yup.boolean(),
  overtimeRate: yup.number().when("overtimeEnabled", {
    is: true,
    then: (schema) =>
      schema
        .typeError("Overtime rate must be a number")
        .required("Overtime rate is required")
        .min(0.01, "Overtime rate must be greater than 0"),
    otherwise: (schema) => schema.notRequired(),
  }),

  color: yup.string().required("Shift color is required"),
});

const initialFormState = {
  name: "Morning",
  timezone: "Asia/Kolkata",
  startTime: "10:00",
  endTime: "19:00",
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  breakTime: { duration: 60, isPaid: false },
  graceTime: 15,
  halfDayHours: 4,
  fullDayHours: 8,
  overtimeEnabled: false,
  overtimeRate: "",
  color: "#3B82F6",
};

const AddShift = () => {
  const navigate = useNavigate();
  const { errorMsg, showSuccess, showError } = useMessage();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const IT_SHIFTS = [
    {
      id: "general",
      label: "General Shift",
      startTime: "09:00",
      endTime: "18:00",
      type: "fixed",
    },
    {
      id: "morning",
      label: "Morning Shift",
      startTime: "06:00",
      endTime: "14:00",
      type: "fixed",
    },
    {
      id: "evening",
      label: "Evening Shift",
      startTime: "14:00",
      endTime: "22:00",
      type: "fixed",
    },
    {
      id: "night",
      label: "Night Shift",
      startTime: "22:00",
      endTime: "06:00",
      type: "fixed",
    },
    {
      id: "rotational",
      label: "Rotational Shift",
      startTime: null,
      endTime: null,
      type: "rotational",
    },
    {
      id: "flexible",
      label: "Flexible Shift",
      startTime: null,
      endTime: null,
      type: "flexible",
    },
    {
      id: "split",
      label: "Split Shift",
      startTime: null,
      endTime: null,
      type: "split",
    },
    {
      id: "on_call",
      label: "On-Call Shift",
      startTime: null,
      endTime: null,
      type: "on-call",
    },
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timezones = [
    { value: "Asia/Kolkata", label: "IST (India)" },
    { value: "America/New_York", label: "EST" },
    { value: "America/Chicago", label: "CST" },
    { value: "America/Los_Angeles", label: "PST" },
    { value: "Europe/London", label: "GMT" },
  ];
  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
  ];

  useEffect(() => {
    if (!formData.overtimeEnabled) {
      setFormData((prev) => ({ ...prev, overtimeRate: null }));
    }
  }, [formData.overtimeEnabled]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("breakTime.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        breakTime: {
          ...prev.breakTime,
          [key]: type === "checkbox" ? checked : Number(value),
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const toggleWorkingDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleCreateShift = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await shiftSchema.validate(formData, { abortEarly: false });
      setErrors({});
      const res = await createShift(formData);
      console.log(res);
      const data = await res.json();
      if (data.success) {
        alert("Shift created successfully");
        setFormData(initialFormState);
      } else {
        alert(data.message);
      }
    } catch (err) {
      if (err.success === false) {
        showError(err.message);
      }
      if (err.inner) {
        const formattedErrors = {};
        err.inner.forEach((e) => {
          formattedErrors[e.path] = e.message;
        });
        setErrors(formattedErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-2xl font-semibold">Add Shift</h2>
        <BackButton onClick={() => navigate("/shifts")} />
      </div>
      <ErrorMessage errorMsg={errorMsg} />
      <form onSubmit={handleCreateShift} className="p-4 space-y-5">
        {/* Name + Timezone */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            labelName="Shift Name"
            name="name"
            value={formData.name}
            handleChange={handleChange}
            errors={errors}
          />
          <SelectField
            label="Timezone"
            name="timezone"
            value={formData.timezone}
            handleChange={handleChange}
            options={timezones}
            error={errors.timezone}
          />
        </div>

        {/* Timing */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="time"
            labelName="Start Time"
            name="startTime"
            value={formData.startTime}
            handleChange={handleChange}
            errors={errors}
          />
          <Input
            type="time"
            labelName="End Time"
            name="endTime"
            value={formData.endTime}
            handleChange={handleChange}
            errors={errors}
          />
        </div>

        {/* Working Days */}
        <div>
          <label className="text-sm font-medium">Working Days *</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {weekDays.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleWorkingDay(day)}
                className={`px-4 py-2 rounded-lg font-medium  ${
                  formData.workingDays.includes(day)
                    ? "bg-accent-dark text-white"
                    : "bg-gray-100 text-accent-dark hover:bg-gray-200"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          {errors.workingDays && (
            <p className="text-sm text-red-500 mt-1">{errors.workingDays}</p>
          )}
        </div>

        {/* Break + Grace */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            name="breakTime.duration"
            labelName="Break Duration (mins)"
            value={formData.breakTime.duration}
            handleChange={handleChange}
            errors={errors}
          />
          <Input
            type="number"
            name="graceTime"
            labelName="Grace Time (mins)"
            value={formData.graceTime}
            handleChange={handleChange}
            errors={errors}
          />
        </div>

        {/* Hours */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            name="halfDayHours"
            labelName="Half Day Hours"
            value={formData.halfDayHours}
            handleChange={handleChange}
            errors={errors}
          />
          <Input
            type="number"
            name="fullDayHours"
            labelName="Full Day Hours"
            value={formData.fullDayHours}
            handleChange={handleChange}
            errors={errors}
          />
        </div>

        {/* Overtime */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="overtimeEnabled"
              checked={formData.overtimeEnabled}
              onChange={handleChange}
            />
            Overtime Enabled
          </label>

          {formData.overtimeEnabled && (
            <Input
              type="number"
              name="overtimeRate"
              labelName="Overtime Rate"
              value={formData.overtimeRate}
              handleChange={handleChange}
              errors={errors}
            />
          )}
        </div>

        {/* Color */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Shift Color</span>
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFormData({ ...formData, color: c })}
              className={`w-8 h-8 rounded flex items-center justify-center ${
                formData.color === c ? "ring-2 ring-accent-dark" : ""
              }`}
              style={{ backgroundColor: c }}
            >
              {formData.color === c ? <IoCheckmarkCircle size={20} /> : ""}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3">
          <CancelButton onClick={() => setFormData(initialFormState)} />
          <Button
            type="submit"
            text={loading ? "Saving..." : "Save"}
            icon={<Save size={18} />}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddShift;
