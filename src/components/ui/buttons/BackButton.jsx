import React from "react";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ onClick }) => {
  return (
    <>
      <button
        onClick={onClick}
        className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white text-sm rounded hover:bg-[#222] hover:dark:text-black hover:dark:bg-white transition-all "
      >
        <ArrowLeft size={16} /> Back
      </button>
    </>
  );
};

export default BackButton;
