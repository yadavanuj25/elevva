import React from "react";
import { LogOut, MapPin } from "lucide-react";

const PunchOutModal = ({
  isOpen,
  onClose,
  workingTime,
  totalBreakTime,
  location,
  isPunchingOut,
  onConfirm,
  formatTimeFromMs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-5 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl p-7 max-w-md w-full shadow-2xl animate-scaleIn">
        <div className="text-xl font-semibold mb-5 text-gray-900">
          Confirm Punch Out
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <h3 className="text-sm text-gray-600 mb-3">Today's Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Total Work</div>
              <div className="text-lg font-semibold font-mono text-gray-900">
                {workingTime}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Total Breaks</div>
              <div className="text-lg font-semibold font-mono text-gray-900">
                {formatTimeFromMs(totalBreakTime)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            Punch Out Location
          </div>
          <div className="text-gray-900 text-sm">
            {location
              ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
              : "Detecting location..."}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            disabled={isPunchingOut}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-5 h-5" />
            {isPunchingOut ? "Punching Out..." : "Confirm Punch Out"}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PunchOutModal;
