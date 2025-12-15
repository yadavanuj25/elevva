// import React, { useState, useEffect, useRef } from "react";
// import DOMPurify from "dompurify";
// import Detail from "../TaskManagement/Detail";
// import { Copy, X } from "lucide-react";

// const TaskQuickViewModal = ({ task, onClose }) => {
//   const [copied, setCopied] = useState(false);
//   const [visible, setVisible] = useState(false);
//   const jobDescRef = useRef(null);

//   const sanitizedJobDesc = DOMPurify.sanitize(
//     task.requirement?.jobDescription || ""
//   );

//   useEffect(() => {
//     setVisible(true);
//   }, []);

//   const handleClose = () => {
//     setVisible(false);
//     setTimeout(onClose, 200);
//   };

//   const copyJobDescription = () => {
//     const visibleText = jobDescRef.current?.innerText || "";
//     navigator.clipboard.writeText(visibleText);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1200);
//   };

//   return (
//     <div
//       className={`fixed inset-0 z-50 flex items-center justify-center p-4
//         transition-opacity duration-200
//         ${visible ? "opacity-100" : "opacity-0"}
//         bg-black bg-opacity-90`}
//     >
//       <div
//         className={`bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl
//           transform transition-all duration-200
//           ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
//       >
//         {/* Header */}
//         <div className="bg-dark text-white px-5 py-3 rounded-t-lg">
//           <div className="flex justify-between items-start">
//             <div className="flex items-center gap-4">
//               <h2 className="text-xl font-semibold">
//                 {task.requirement?.client?.clientName}
//               </h2>
//               - <p>{task.requirement?.techStack}</p>
//             </div>

//             <button
//               onClick={handleClose}
//               className="text-red-600 bg-white p-1 rounded-full hover:bg-gray-100 "
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-6">
//           {/* Details Grid */}
//           <div className="grid grid-cols-3 gap-5">
//             <Detail
//               label="Client"
//               value={task.requirement?.client?.clientName}
//             />
//             <Detail
//               label="Requirement Code"
//               value={task.requirement?.requirementCode}
//             />
//             <Detail label="Created By" value={task.requirement?.createdBy} />
//             <Detail
//               label="Position Status"
//               value={task.requirement?.positionStatus}
//             />
//             <Detail label="Work Mode" value={task.requirement?.workMode} />
//             <Detail label="Location" value={task.requirement?.workLocation} />
//             <Detail label="Experience" value={task.requirement?.experience} />
//             <Detail
//               label="Total Positions"
//               value={task.requirement?.totalPositions}
//             />
//             <Detail
//               label="Budget Details"
//               value={`${task.requirement?.budgetType} - ${task.requirement?.currency}  - ${task.requirement?.budget}`}
//             />
//             <Detail label="Priority" value={task.priority} />
//             <Detail label="Status" value={task.status} />
//           </div>

//           {/* Job Description Full Width */}
//           <div className="w-full">
//             <div className="flex justify-between items-center mb-1">
//               <p className="text-sm text-gray-600">Job Description</p>

//               <button
//                 className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
//                 onClick={copyJobDescription}
//               >
//                 <Copy size={16} />
//                 <span>{copied ? "Copied!" : "Copy"}</span>
//               </button>
//             </div>

//             <p
//               ref={jobDescRef}
//               className="p-3 rounded border text-sm leading-relaxed"
//               dangerouslySetInnerHTML={{ __html: sanitizedJobDesc }}
//             ></p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default TaskQuickViewModal;

import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import Detail from "../TaskManagement/Detail";
import { Copy, X } from "lucide-react";
import Modal from "../modals/Modal";

const TaskQuickViewModal = ({ task, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);
  const jobDescRef = useRef(null);

  const sanitizedJobDesc = DOMPurify.sanitize(
    task.requirement?.jobDescription || ""
  );

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const handleClose = () => {
    onClose();
  };

  const copyJobDescription = () => {
    const visibleText = jobDescRef.current?.innerText || "";
    navigator.clipboard.writeText(visibleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Modal isOpen={!!task} onClose={onClose}>
      <div
        className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-opacity duration-300 ease-out
        ${show ? "opacity-100" : "opacity-0"}
        bg-black/80
      `}
      >
        <div
          className={`
          bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl
          transform transition-all duration-300 ease-out
          ${
            show
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }
        `}
        >
          {/* Header */}
          <div className="bg-dark text-white px-5 py-3 rounded-t-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {task.requirement?.client?.clientName}
                </h2>
                <span>-</span>
                <p>{task.requirement?.techStack}</p>
              </div>

              <button
                onClick={handleClose}
                className="text-red-600 bg-white p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-5">
              <Detail
                label="Client"
                value={task.requirement?.client?.clientName}
              />
              <Detail
                label="Requirement Code"
                value={task.requirement?.requirementCode}
              />
              <Detail label="Created By" value={task.requirement?.createdBy} />
              <Detail
                label="Position Status"
                value={task.requirement?.positionStatus}
              />
              <Detail label="Work Mode" value={task.requirement?.workMode} />
              <Detail label="Location" value={task.requirement?.workLocation} />
              <Detail label="Experience" value={task.requirement?.experience} />
              <Detail
                label="Total Positions"
                value={task.requirement?.totalPositions}
              />
              <Detail
                label="Budget Details"
                value={`${task.requirement?.budgetType} - ${task.requirement?.currency} - ${task.requirement?.budget}`}
              />
              <Detail label="Priority" value={task.priority} />
              <Detail label="Status" value={task.status} />
            </div>

            {/* Job Description */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-600">Job Description</p>

                <button
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  onClick={copyJobDescription}
                >
                  <Copy size={16} />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              <div
                ref={jobDescRef}
                className="p-3 rounded border text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizedJobDesc }}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskQuickViewModal;
