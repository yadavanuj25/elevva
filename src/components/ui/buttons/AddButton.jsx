import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const AddButton = ({ addLink, title }) => {
  return (
    <>
      <Link
        to={addLink}
        className="px-2 py-1.5 flex gap-1 items-center bg-accent-dark text-white rounded-md hover:bg-[#222] hover:dark:text-black hover:dark:bg-white transition"
      >
        <span>
          <Plus size={15} />
        </span>
        <span>Add New {title}</span>
      </Link>
    </>
  );
};

export default AddButton;
