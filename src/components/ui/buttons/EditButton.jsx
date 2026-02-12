import React from "react";
import { Pencil } from "lucide-react";

const EditButton = ({ onClick }) => {
  return (
    <>
      <button
        className="px-4 py-2 bg-accent-dark backdrop-blur-sm text-white  rounded-lg font-semibold hover:bg-accent-light hover:text-accent-dark shadow-md  transition duration-300 ease-in-out flex items-center gap-2"
        onClick={onClick}
      >
        <Pencil size={16} /> Edit
      </button>
    </>
  );
};
export default EditButton;
