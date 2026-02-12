// import React from "react";
// import { Link } from "react-router-dom";
// import { Plus } from "lucide-react";

// const AddButton = ({ onClick, title }) => {
//   return (
//     <>
//       <Link
//         to={onClick}
//         className="px-2 py-1.5 flex gap-1 items-center bg-accent-dark text-white rounded-md hover:bg-[#222] hover:dark:text-black hover:dark:bg-white transition-all"
//       >
//         <span>
//           <Plus size={15} />
//         </span>
//         <span>Add New {title}</span>
//       </Link>
//     </>
//   );
// };

// export default AddButton;

import React from "react";
import { Plus } from "lucide-react";

const AddButton = ({ onClick, title }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-accent-dark backdrop-blur-sm text-white  rounded-lg font-semibold hover:bg-accent-light hover:text-accent-dark transition-all flex items-center gap-2"
      // className="px-2 py-1.5 flex gap-1 items-center bg-accent-dark text-white rounded-md hover:bg-[#222] hover:dark:text-black hover:dark:bg-white transition-all"
    >
      <Plus className="w-5 h-5" />
      <span>Add New {title}</span>
    </button>
  );
};

export default AddButton;
