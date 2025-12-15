import React from "react";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ onClick }) => {
  return (
    <>
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-[#222] transition"
      >
        <ArrowLeft size={16} /> Back
      </button>
    </>
  );
};

export default BackButton;
