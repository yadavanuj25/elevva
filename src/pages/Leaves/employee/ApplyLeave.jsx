import React, { useState } from "react";
import * as yup from "yup";
import Input from "../../../components/ui/Input";
import SelectField from "../../../components/ui/SelectField";
import BasicDatePicker from "../../../components/ui/BasicDatePicker";
import { Save, Upload, X } from "lucide-react";
import Textareafield from "../../../components/ui/formFields/Textareafield";
import ReadOnlyInput from "../../../components/ui/formFields/ReadOnlyInput";
import Button from "../../../components/ui/Button";
import CancelButton from "../../../components/ui/buttons/Cancel";

const todayStr = new Date().toISOString().split("T")[0];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const leaveSchema = yup.object().shape({
  employeeId: yup.string().required(),
  employeeName: yup.string().required(),
  leaveType: yup.string().required("Leave type is required"),
  fromDate: yup
    .string()
    .test(
      "not-past",
      "From date cannot be in the past",
      (val) => !!val && val >= todayStr
    )
    .required("From date is required"),
  toDate: yup
    .string()
    .test(
      "after-from",
      "To date must be same or after From date",
      function (val) {
        const { fromDate } = this.parent;
        if (!val || !fromDate) return true;
        return val >= fromDate;
      }
    )
    .required("To date is required"),
  isHalfDay: yup.boolean(),
  reason: yup
    .string()
    .required("Reason is required")
    .min(10, "Minimum 10 characters required"),
  attachment: yup
    .mixed()
    .nullable()
    .test("fileSize", "File must be under 5MB", (file) => {
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE;
    }),
});

const initialValues = {
  employeeId: "EMP001",
  employeeName: "Anuj Yadav",
  leaveType: "",
  fromDate: "",
  toDate: "",
  isHalfDay: false,
  reason: "",
  attachment: null,
};

const ApplyLeaveForm = () => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");

  const calculateDays = (from, to, isHalfDay) => {
    if (!from || !to) return 0;
    const start = new Date(from);
    const end = new Date(to);
    const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diff === 1 && isHalfDay ? 0.5 : diff;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setValues((prev) => ({ ...prev, [name]: val }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setAttachmentError("File size must be less than 5MB");
      return;
    }

    setAttachmentError("");
    setValues((prev) => ({ ...prev, attachment: file }));
  };

  const removeFile = () => {
    setValues((prev) => ({ ...prev, attachment: null }));
    setAttachmentError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await leaveSchema.validate(values, { abortEarly: false });
      if (attachmentError) return;
      const payload = {
        employeeId: values.employeeId,
        employeeName: values.employeeName,
        leaveType: values.leaveType,
        fromDate: values.fromDate,
        toDate: values.toDate,
        isHalfDay: values.isHalfDay,
        reason: values.reason,
        totalDays: calculateDays(
          values.fromDate,
          values.toDate,
          values.isHalfDay
        ),
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };
      const existingLeaves =
        JSON.parse(localStorage.getItem("leaveApplications")) || [];
      existingLeaves.push(payload);
      localStorage.setItem("leaveApplications", JSON.stringify(existingLeaves));
      alert("Leave applied successfully");
      setValues(initialValues);
      setErrors({});
      setAttachmentError("");
    } catch (validationError) {
      const formErrors = {};
      validationError.inner.forEach((err) => {
        if (err.path) formErrors[err.path] = err.message;
      });
      setErrors(formErrors);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setValues(initialValues);
    setErrors({});
    setAttachmentError("");
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white ">
          Apply Leave
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Submit your leave request for manager approval
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg p-4 space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <ReadOnlyInput labelName="Employee ID" value={values.employeeId} />
          <ReadOnlyInput
            labelName="Employee Name"
            value={values.employeeName}
          />
          <BasicDatePicker
            name="fromDate"
            labelName="From Date"
            value={values.fromDate}
            handleChange={handleChange}
            errors={errors}
          />

          <BasicDatePicker
            name="toDate"
            labelName="To Date"
            value={values.toDate}
            handleChange={handleChange}
            errors={errors}
          />
          <SelectField
            name="leaveType"
            label="Leave Type"
            value={values.leaveType}
            options={[
              { label: "Casual Leave", value: "CASUAL" },
              { label: "Sick Leave", value: "SICK" },
              { label: "Paid Leave", value: "PAID" },
              { label: "Unpaid Leave", value: "UNPAID" },
            ]}
            handleChange={handleChange}
            error={errors.leaveType}
          />
          <ReadOnlyInput
            labelName="Total Leave Days"
            value={calculateDays(
              values.fromDate,
              values.toDate,
              values.isHalfDay
            )}
          />
          {values.fromDate === values.toDate && values.fromDate && (
            <div className=" flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <input
                type="checkbox"
                name="isHalfDay"
                checked={values.isHalfDay}
                onChange={handleChange}
                className="accent-accent-dark"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Apply as Half Day
              </span>
            </div>
          )}
        </div>

        {/* Reason */}
        <div className="col-span-2">
          <Textareafield
            name="reason"
            label="Reason for Leave"
            value={values.reason}
            handleChange={handleChange}
          />
        </div>
        <div className="col-span-2">
          <label className="text-sm font-semibold mb-2 block">
            Attach Proof (Optional, max 5MB)
          </label>
          {!values.attachment ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-accent-dark transition">
              <Upload className="w-6 h-6 mb-2 text-gray-500" />
              <span className="text-sm text-gray-600">
                Click to upload (PDF, JPG, PNG)
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.png,.jpeg"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <span className="text-sm truncate">{values.attachment.name}</span>
              <button
                type="button"
                onClick={removeFile}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          )}
          {attachmentError && (
            <p className="text-red-500 text-sm mt-2">{attachmentError}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 ">
          <CancelButton onClick={handleCancel} />
          <Button
            type="submit"
            text="Apply Leave"
            icon={<Save size={18} />}
            loading={loading}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default ApplyLeaveForm;
