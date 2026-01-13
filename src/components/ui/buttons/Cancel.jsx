import React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const CancelButton = ({ to, onClick, label = "Cancel", className = "" }) => {
  const navigate = useNavigate();
  const handleCancel = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCancel}
      className={`
        inline-flex items-center gap-2
        px-2 py-1 rounded
        text-sm font-medium bg-gray-300  text-gray-900 hover:bg-gray-400
        transition-all
        ${className}
      `}
    >
      <X size={18} />
      {label}
    </button>
  );
};

export default CancelButton;
