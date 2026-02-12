import React from "react";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ onClick }) => {
  return (
    <>
      <button
        onClick={onClick}
        className="px-4 py-2 bg-black backdrop-blur-sm text-white  rounded-lg font-semibold hover:bg-accent-light hover:text-accent-dark transition-all flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Back
      </button>
    </>
  );
};

export default BackButton;
