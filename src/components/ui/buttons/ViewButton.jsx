import React from "react";
import { Eye } from "lucide-react";

const ViewButton = ({ onClick }) => {
  return (
    <>
      <button
        className="text-white bg-[#1abe17] px-1 py-1 rounded hover:bg-[#222] hover:dark:text-black hover:dark:bg-white"
        onClick={onClick}
      >
        <Eye size={18} />
      </button>
    </>
  );
};

export default ViewButton;
