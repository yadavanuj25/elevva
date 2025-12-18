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

// import React from "react";
// import { Pencil } from "lucide-react";

// const EditButton = ({ onClick }) => {
//   return (
//     <div className="relative inline-block group">
//       <button
//         type="button"
//         onClick={onClick}
//         className="text-white bg-dark px-1 py-1 rounded hover:bg-[#222]"
//       >
//         <Pencil size={18} />
//       </button>

//       <span
//         className="
//           absolute bottom-full left-1/2 -translate-x-1/2 mb-1
//           whitespace-nowrap text-xs text-white bg-black px-2 py-0.5 rounded
//           opacity-0 group-hover:opacity-100 transition
//           pointer-events-none
//         "
//       >
//         Edit
//       </span>
//     </div>
//   );
// };

// export default EditButton;
