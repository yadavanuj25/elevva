import React from "react";
import { X } from "lucide-react";

const Close = ({ handleClose }) => {
  return (
    <button
      onClick={handleClose}
      className="bg-gray-200 text-black p-1 rounded hover:bg-gray-400"
    >
      <X size={20} />
    </button>
  );
};

export default Close;
