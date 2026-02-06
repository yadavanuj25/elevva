import React from "react";
import { Coffee, Utensils, Soup, BedDouble } from "lucide-react";

const breakTypes = {
  lunch: {
    name: "Lunch-Break",
    desc: "Meal time break",
    icon: <Utensils />,
    bg: "bg-green-600",
  },
  tea: {
    name: "Tea-Break",
    desc: "Tea time break",
    icon: <Soup />,
    bg: "bg-orange-600",
  },
  personal: {
    name: "Personal-Break",
    desc: "Restroom, coffee",
    icon: <BedDouble />,
    bg: "bg-blue-600",
  },
};

const BreakTypeModal = ({
  isOpen,
  onClose,
  selectedBreakType,
  onSelectBreakType,
  onStartBreak,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80  flex items-center justify-center p-5 z-50 animate-fadeIn">
      <div className="space-y-10 bg-white rounded-xl p-6 max-w-xl w-full shadow-2xl animate-scaleIn">
        <div className="text-xl font-semibold mb-5 text-gray-900">
          Select Break Type
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-3">
          {Object.entries(breakTypes).map(([key, value]) => (
            <div
              key={key}
              onClick={() => onSelectBreakType(value.name)}
              className={`cursor-pointer transition-all border-2 rounded-xl
                flex flex-col items-center justify-between p-4 min-h-[120px]
                ${
                  selectedBreakType === value.name
                    ? "bg-accent-light border border-accent-dark"
                    : "bg-gray-50 border-transparent hover:bg-gray-100 hover:border-accent-dark"
                }`}
            >
              <div
                className={`w-10 h-10 mb-4 ${value.bg} rounded-lg flex items-center justify-center text-xl text-white`}
              >
                {value.icon}
              </div>

              <div className="text-center">
                <div className="font-semibold text-gray-900">{value.name}</div>
                <div className="text-sm text-gray-600">{value.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onStartBreak}
            disabled={!selectedBreakType}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all ${
              selectedBreakType
                ? "bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Coffee className="w-5 h-5" />
            Start Break
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakTypeModal;
