import React from "react";
import { Eye } from "lucide-react";

const ViewButton = ({ onClick }) => {
  return (
    <>
      <button
        className="text-white bg-[#1abe17] px-1 py-1 rounded hover:bg-[#222]"
        onClick={onClick}
      >
        <Eye size={18} />
      </button>
    </>
  );
};

export default ViewButton;
