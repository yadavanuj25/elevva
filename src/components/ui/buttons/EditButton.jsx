import React from "react";
import { Pencil } from "lucide-react";

const EditButton = ({ onClick }) => {
  return (
    <>
      <button
        className="text-white bg-dark px-1 py-1 rounded hover:bg-[#222]"
        onClick={onClick}
      >
        <Pencil size={18} />
      </button>
    </>
  );
};

export default EditButton;
