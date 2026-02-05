import React from "react";
import { LogIn, MapPin, House } from "lucide-react";
import { BsBuildings } from "react-icons/bs";
import ToggleButton from "../../ui/buttons/ToggleButton";
import Textareafield from "../../ui/formFields/Textareafield";

const PunchInModal = ({
  isOpen,
  onClose,
  formData,
  onWorkModeToggle,
  onNoteChange,
  location,
  isPunchingIn,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-5 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl p-7 max-w-md w-full shadow-2xl animate-scaleIn">
        <div className="text-xl font-semibold mb-5 text-gray-900">
          Confirm Punch In
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <ToggleButton
            label="Choose your remote mode"
            className="flex-col gap-2"
            value={formData.workMode}
            onChange={onWorkModeToggle}
            activeValue="office"
            inactiveValue="home"
            activeLabel="Office"
            inactiveLabel="Home"
            icon1={<BsBuildings size={16} />}
            icon2={<House size={16} />}
          />
        </div>

        <Textareafield
          name="notes"
          label="Notes (Optional)"
          value={formData.notes}
          handleChange={onNoteChange}
        />

        <div className="bg-gray-50 rounded-xl p-4 mb-5 mt-4 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            Punch in Location
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
            disabled={isPunchingIn}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-green-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn className="w-5 h-5" />
            {isPunchingIn ? "Punching in..." : "Confirm Punch in"}
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

export default PunchInModal;
