import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { IoCheckmarkCircle } from "react-icons/io5";
import Input from "../../ui/Input";
import SelectField from "../../ui/SelectField";
import CancelButton from "../../ui/buttons/Cancel";
import Button from "../../ui/Button";
import BackButton from "../../ui/buttons/BackButton";
import FormSkeleton from "../../loaders/FormSkeleton";
import ErrorMessage from "../../modals/errors/ErrorMessage";
import { TimePicker } from "../../ui/TimePicker";
import ToggleButton from "../../ui/buttons/ToggleButton";
import { shiftSchema } from "./shiftSchema";

import {
  getShiftById,
  updateShift,
  createShift,
} from "../../../services/shiftServices";
import { useMessage } from "../../../auth/MessageContext";
import { swalSuccess, swalError } from "../../../utils/swalHelper";
import {
  workingShifts,
  initialFormState,
  colors,
  weekDays,
  timezones,
} from "../../../contstants/shifts/shift";

const ShiftForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { errorMsg, showSuccess, showError } = useMessage();

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  const isEditMode = Boolean(id);

  // Fetch shift data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchShiftById();
    }
  }, [id]);

  // Clear overtime rate when overtime is disabled
  useEffect(() => {
    if (!formData.overtimeEnabled) {
      setFormData((prev) => ({ ...prev, overtimeRate: null }));
    }
  }, [formData.overtimeEnabled]);

  const fetchShiftById = async () => {
    try {
      setFetchingData(true);
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
        isActive: data?.isActive ?? true,
      });
    } catch (err) {
      showError(err.message || "Failed to fetch shift data");
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _, ...rest } = prev;
      return rest;
    });

    if (name.startsWith("breakTime.")) {
      const key = name.split(".")[1];

      setErrors((prev) => {
        if (!prev?.breakTime?.[key]) return prev;
        return {
          ...prev,
          breakTime: {
            ...prev.breakTime,
            [key]: undefined,
          },
        };
      });
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

  const handleShiftToggle = (shift) => {
    setFormData((p) => ({ ...p, isActive: shift }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await shiftSchema.validate(formData, { abortEarly: false });
      setErrors({});

      let res;
      if (isEditMode) {
        res = await updateShift(id, formData);
        showSuccess(res.message || "Shift updated successfully");
      } else {
        res = await createShift(formData);
        swalSuccess(res.message || "Shift created successfully");
      }

      if (res.success) {
        navigate("/hrms/shifts");
        if (!isEditMode) {
          setFormData(initialFormState);
        }
      } else {
        swalError(res.message);
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

  const handleCancel = () => {
    setFormData(initialFormState);
    setErrors({});
    navigate("/hrms/shifts");
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600 rounded-xl">
      <div className="mb-4 pb-2 flex justify-between items-center border-b border-[#E8E8E9] dark:border-gray-600">
        <h2>{isEditMode ? "Update Shiftssss" : "Add Shiftssss"}</h2>
        <BackButton onClick={() => navigate("/hrms/shifts")} />
      </div>

      <ErrorMessage errorMsg={errorMsg} />

      {fetchingData ? (
        <FormSkeleton rows={6} />
      ) : (
        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Name + Timezone */}
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Shift Name"
              name="name"
              value={formData.name}
              handleChange={handleChange}
              options={workingShifts}
              error={errors.name}
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
            <TimePicker
              label="Start Time"
              name="startTime"
              value={formData.startTime}
              handleChange={handleChange}
              error={errors?.startTime}
            />
            <TimePicker
              label="End Time"
              name="endTime"
              value={formData.endTime}
              handleChange={handleChange}
              error={errors?.endTime}
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
                  className={`px-4 py-2 rounded-lg font-medium ${
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

          {/* Active/Inactive Toggle */}
          <ToggleButton
            label="Shift"
            value={formData.isActive}
            onChange={handleShiftToggle}
            activeValue={true}
            inactiveValue={false}
            activeLabel="Active"
            inactiveLabel="InActive"
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <CancelButton onClick={handleCancel} />
            <Button
              type="submit"
              text={
                loading
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                    ? "Update"
                    : "Save"
              }
              icon={<Save size={18} />}
              disabled={loading}
              loading={loading}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default ShiftForm;
