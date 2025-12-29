import React from "react";
import { Pencil } from "lucide-react";

const EditButton = ({ onClick }) => {
  return (
    <>
      <button
        className="flex items-center gap-2 text-white bg-accent-dark px-2 py-0.5 rounded hover:bg-[#222] hover:dark:text-black hover:dark:bg-white transition"
        onClick={onClick}
      >
        <Pencil size={16} /> Edit
      </button>
    </>
  );
};

export default EditButton;
