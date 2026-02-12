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
      className=//   text-sm font-medium bg-gray-300  text-gray-900 hover:bg-gray-400 //   px-2 py-1 rounded //   inline-flex items-center gap-2 // {`
      //   transition-all
      //   ${className}
      // `}
      {`px-4 py-2 bg-accent-dark backdrop-blur-sm text-white  rounded-lg font-semibold hover:bg-accent-light hover:text-accent-dark shadow-md  transition duration-300 ease-in-out inline-flex items-center gap-2 ${className}`}
    >
      <X size={18} />
      {label}
    </button>
  );
};

export default CancelButton;
