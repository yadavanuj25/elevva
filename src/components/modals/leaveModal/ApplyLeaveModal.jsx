import React from "react";
import Close from "../../ui/buttons/Close";

const ApplyLeaveModal = ({
  showApplyModal,
  setShowApplyModal,
  formData,
  setFormData,
  calculateDays,
  handleSubmit,
}) => {
  if (!showApplyModal) return null;

  return (
    <div className="fixed inset-0 text-black bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-accent-dark text-white px-5 py-3 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                {showApplyModal ? "Apply for Leave" : "Edit for Leave"}
              </h2>
            </div>
            <Close handleClose={() => setShowApplyModal(false)} />
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Leave Type</label>
            <select
              value={formData.leaveType}
              onChange={(e) =>
                setFormData({ ...formData, leaveType: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="" disabled>
                Select Leave Type
              </option>
              <option value="casual">Casual</option>
              <option value="sick">Sick</option>
              <option value="earned">Earned</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Half Day Option */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="halfDay"
                checked={formData.halfDay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    halfDay: e.target.checked,
                    halfDaySession: e.target.checked
                      ? formData.halfDaySession
                      : "",
                  })
                }
                className="w-4 h-4 text-purple-600 border-[#E8E8E9] rounded"
              />
              <label htmlFor="halfDay" className="text-sm font-medium">
                Apply as Half Day
              </label>
            </div>

            {/* Half Day Session */}
            {formData.halfDay && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Half Day Session
                </label>
                <select
                  value={formData.halfDaySession}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      halfDaySession: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select session</option>
                  <option value="first-half">first-half</option>
                  <option value="second-half">second-half</option>
                </select>
              </div>
            )}
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm">
              <strong>Total Days:</strong> {calculateDays()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reason</label>
            <textarea
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-2 border rounded-lg"
            ></textarea>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowApplyModal(false)}
              className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-accent-dark text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
