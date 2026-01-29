import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { IoCheckmarkCircle } from "react-icons/io5";

import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import CancelButton from "../ui/buttons/Cancel";
import Button from "../ui/Button";

import { getShiftById, updateShift } from "../../services/hrmsServices";
import { useMessage } from "../../auth/MessageContext";
import BackButton from "../ui/buttons/BackButton";
import FormSkeleton from "../loaders/FormSkeleton";
import ErrorMessage from "../modals/errors/ErrorMessage";

const shiftSchema = yup.object({
  name: yup.string().required("Shift name is required"),
  timezone: yup.string().required("Timezone is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),

  workingDays: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one working day"),

  breakTime: yup.object({
    duration: yup
      .number()
      .typeError("Break duration must be a number")
      .required("Break duration is required")
      .min(30, "Minimum 30 minutes"),
    isPaid: yup.boolean(),
  }),

  graceTime: yup
    .number()
    .typeError("Grace time must be a number")
    .min(0)
    .required(),

  halfDayHours: yup
    .number()
    .typeError("Half day hours must be a number")
    .moreThan(0)
    .required(),

  fullDayHours: yup
    .number()
    .typeError("Full day hours must be a number")
    .moreThan(0)
    .required(),

  overtimeEnabled: yup.boolean(),

  overtimeRate: yup.number().when("overtimeEnabled", {
    is: true,
    then: (s) =>
      s
        .typeError("Overtime rate must be a number")
        .required("Overtime rate is required")
        .min(1),
    otherwise: (s) => s.nullable(),
  }),

  color: yup.string().required("Shift color is required"),
});

const initialFormState = {
  name: "",
  timezone: "",
  startTime: "",
  endTime: "",
  workingDays: [],
  breakTime: { duration: "", isPaid: false },
  graceTime: "",
  halfDayHours: "",
  fullDayHours: "",
  overtimeEnabled: false,
  overtimeRate: null,
  color: "#3B82F6",
};

const EditShift = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { errorMsg, showSuccess, showError } = useMessage();

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  /* -------------------- PREFILL -------------------- */
  useEffect(() => {
    if (id) fetchShiftById();
  }, [id]);

  const fetchShiftById = async () => {
    try {
      setLoading(true);
      const res = await getShiftById(id);
      const data = res?.data || res;

      setFormData({
        name: data?.name ?? "",
        timezone: data?.timezone ?? "",
        startTime: data?.startTime ?? "",
        endTime: data?.endTime ?? "",
        workingDays: data?.workingDays ?? [],
        breakTime: {
          duration: data?.breakTime?.duration ?? "",
          isPaid: data?.breakTime?.isPaid ?? false,
        },
        graceTime: data?.graceTime ?? "",
        halfDayHours: data?.halfDayHours ?? "",
        fullDayHours: data?.fullDayHours ?? "",
        overtimeEnabled: data?.overtimeEnabled ?? false,
        overtimeRate: data?.overtimeRate ?? null,
        color: data?.color ?? "#3B82F6",
      });
    } catch (err) {
      console.error("Failed to fetch shift", err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- HANDLERS -------------------- */
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await shiftSchema.validate(formData, { abortEarly: false });
      const res = await updateShift(id, formData);
      showSuccess(res.message || "Shift updated successfully");
      navigate("/shifts");
    } catch (err) {
      if (err.success === false) {
        showError(err.message);
      }
      if (err.inner) {
        const formatted = {};
        err.inner.forEach((e) => (formatted[e.path] = e.message));
        setErrors(formatted);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
        <div className="mb-4 pb-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-semibold">Update Shift</h2>
          <BackButton onClick={() => navigate("/shifts")} />
        </div>
        <ErrorMessage errorMsg={errorMsg} />
        {loading ? (
          <FormSkeleton rows={6} />
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-5">
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

            <div>
              <label className="text-sm font-medium">Working Days *</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {weekDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleWorkingDay(day)}
                    className={`px-4 py-2 rounded-lg ${
                      formData.workingDays.includes(day)
                        ? "bg-accent-dark text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {errors.workingDays && (
                <p className="text-red-500 text-sm">{errors.workingDays}</p>
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

            <div className="flex justify-end gap-3 pt-3">
              <CancelButton onClick={() => setFormData(initialFormState)} />
              <Button
                type="submit"
                text="Update"
                icon={<Save size={18} />}
                loading={loading}
                disabled={loading}
              />
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default EditShift;
