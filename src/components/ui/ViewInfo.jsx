// import React from "react";

// const ViewInfo = ({ icon, label, value }) => (
//   <div className="flex items-center gap-2 mt-4 text-sm text-gray-700 dark:text-gray-300">
//     {icon && <span className=" text-gray-500 dark:text-gray-400">{icon}</span>}
//     <p className="flex items-center gap-2">
//       <span className="font-medium">{label}:</span>
//       {value ? (
//         <span>{value}</span>
//       ) : (
//         <span className="flex items-center gap-1 ">
//           <span className="inline-block h-1.5 w-1.5 bg-red-600 rounded-full"></span>
//           Not Available
//         </span>
//       )}
//     </p>
//   </div>
// );

// export default ViewInfo;

import React from "react";
import { Globe, MoveUpRight } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import { CiLinkedin } from "react-icons/ci";
import { Link } from "react-router-dom";

const ViewInfo = ({ icon, label, value, type }) => {
  const getIcon = () => {
    if (type === "linkedin") return <CiLinkedin size={16} />;
    if (type === "website") return <Globe size={16} />;
    return icon || null;
  };
  if (type === "linkedin" || type === "website") {
    return (
      <div className="flex items-center gap-3 mt-4 text-sm text-gray-700 dark:text-gray-300">
        <span className="text-gray-500 dark:text-gray-400">{getIcon()}</span>
        <span className="font-medium">{label}:</span>
        {value ? (
          <Link
            to={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1  hover:text-blue-700"
          >
            Go to <MoveUpRight size={14} />
          </Link>
        ) : (
          <span className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 bg-red-600 rounded-full"></span>
            Not Available
          </span>
        )}
      </div>
    );
  }

  // --- CASE 2: Normal fields (default old design) ---
  return (
    <div className="flex items-center gap-2 mt-4 text-sm text-gray-700 dark:text-gray-300">
      {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
      <p className="flex items-center gap-2">
        <span className="font-medium">{label}:</span>
        {value ? (
          <span>{value}</span>
        ) : (
          <span className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 bg-red-600 rounded-full"></span>
            Not Available
          </span>
        )}
      </p>
    </div>
  );
};

export default ViewInfo;
