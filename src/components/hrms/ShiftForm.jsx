import React from "react";
import { Save } from "lucide-react";
import { IoCheckmarkCircle } from "react-icons/io5";

import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import CancelButton from "../ui/buttons/Cancel";
import ToggleButton from "../ui/buttons/ToggleButton";
import { TimePicker } from "../ui/TimePicker";

import {
  WORKING_SHIFTS,
  WEEK_DAYS,
  TIMEZONES,
  COLORS,
} from "../../contstants/shifts/shift";

const ShiftForm = ({
  title,
  formData,
  setFormData,
  errors,
  loading,
  onSubmit,
  onCancel,
  submitText = "Save",
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("breakTime.")) {
      const key = name.split(".")[1];
      setFormData((p) => ({
        ...p,
        breakTime: {
          ...p.breakTime,
          [key]: type === "checkbox" ? checked : Number(value),
        },
      }));
      return;
    }

    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleWorkingDay = (day) => {
    setFormData((p) => ({
      ...p,
      workingDays: p.workingDays.includes(day)
        ? p.workingDays.filter((d) => d !== day)
        : [...p.workingDays, day],
    }));
  };

  return (
    <form onSubmit={onSubmit} className="p-4 space-y-5">
      <h2 className="text-2xl font-semibold">{title}</h2>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Shift Name"
          name="name"
          value={formData.name}
          handleChange={handleChange}
          options={WORKING_SHIFTS}
          error={errors.name}
        />
        <SelectField
          label="Timezone"
          name="timezone"
          value={formData.timezone}
          handleChange={handleChange}
          options={TIMEZONES}
          error={errors.timezone}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TimePicker
          label="Start Time"
          name="startTime"
          value={formData.startTime}
          handleChange={handleChange}
          error={errors.startTime}
        />
        <TimePicker
          label="End Time"
          name="endTime"
          value={formData.endTime}
          handleChange={handleChange}
          error={errors.endTime}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Working Days *</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {WEEK_DAYS.map((day) => (
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

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Shift Color</span>
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFormData({ ...formData, color: c })}
            className={`w-8 h-8 rounded ${
              formData.color === c ? "ring-2 ring-accent-dark" : ""
            }`}
            style={{ backgroundColor: c }}
          >
            {formData.color === c && <IoCheckmarkCircle size={18} />}
          </button>
        ))}
      </div>

      <ToggleButton
        label="Shift"
        value={formData.isActive}
        onChange={(v) => setFormData({ ...formData, isActive: v })}
        activeValue={true}
        inactiveValue={false}
        activeLabel="Active"
        inactiveLabel="Inactive"
      />

      <div className="flex justify-end gap-3 pt-3">
        <CancelButton onClick={onCancel} />
        <Button
          type="submit"
          text={submitText}
          icon={<Save size={18} />}
          loading={loading}
        />
      </div>
    </form>
  );
};

export default ShiftForm;
