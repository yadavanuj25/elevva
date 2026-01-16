import { useEffect, useState } from "react";
import { useLeave } from "../../../hooks/Leaves/useLeave";

const ApplyLeave = () => {
  const { leaveTypes, applyLeave, loading } = useLeave();

  const employeeId = "EMP001";
  const employeeName = "Anuj Yadav";

  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    halfDay: false,
    reason: "",
  });

  const [error, setError] = useState("");

  // =====================
  // HANDLERS
  // =====================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const calculateDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;
    return form.halfDay ? 0.5 : diff;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.leaveType || !form.startDate || !form.endDate) {
      setError("Please fill all required fields");
      return;
    }

    if (new Date(form.startDate) > new Date(form.endDate)) {
      setError("End date cannot be before start date");
      return;
    }

    const payload = {
      employeeId,
      employeeName,
      leaveType: form.leaveType,
      startDate: form.startDate,
      endDate: form.endDate,
      totalDays: calculateDays(),
      reason: form.reason,
    };

    try {
      await applyLeave(payload);
      alert("Leave applied successfully");
      setForm({
        leaveType: "",
        startDate: "",
        endDate: "",
        halfDay: false,
        reason: "",
      });
    } catch {
      setError("Failed to apply leave");
    }
  };

  // =====================
  // UI
  // =====================
  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Apply Leave</h2>

      <form className="leave-form" onSubmit={handleSubmit}>
        {/* Leave Type */}
        <div>
          <label className="leave-label">Leave Type *</label>
          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            className="leave-select"
          >
            <option value="">Select leave type</option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="leave-label">Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="leave-input"
            />
          </div>

          <div>
            <label className="leave-label">End Date *</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="leave-input"
            />
          </div>
        </div>

        {/* Half Day */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="halfDay"
            checked={form.halfDay}
            onChange={handleChange}
          />
          <span className="text-sm">Half Day</span>
        </div>

        {/* Reason */}
        <div>
          <label className="leave-label">Reason</label>
          <textarea
            name="reason"
            rows="3"
            value={form.reason}
            onChange={handleChange}
            className="leave-textarea"
          />
        </div>

        {/* Total Days */}
        <p className="text-sm text-gray-600">
          Total Days: <span className="font-medium">{calculateDays()}</span>
        </p>

        {/* Error */}
        {error && <p className="leave-error">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="leave-btn-secondary"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="leave-btn-primary"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Apply Leave"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyLeave;
