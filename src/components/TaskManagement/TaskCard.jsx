// import React, { useState } from "react";
// import TaskQuickViewModal from "../TaskManagement/TaskQuickViewModal";
// import { updateMetrics, updateTaskStatus } from "../../services/taskServices";

// const TaskCard = ({ task, onClick, onRefresh, onDragStart }) => {
//   const [showMetricsForm, setShowMetricsForm] = useState(false);
//   const [metrics, setMetrics] = useState(task.metrics);
//   const [showQuickView, setShowQuickView] = useState(false);

//   const priorityColors = {
//     Critical: " text-red-800 border-red-500",
//     High: " text-orange-800 border-red-300",
//     Medium: " text-yellow-800 border-yellow-500",
//     Low: " text-green-800 border-green-500",
//   };
//   const priority = {
//     Critical: "bg-red-900  border-red-300",
//     High: " bg-red-600 border-orange-300",
//     Medium: " bg-yellow-600 border-yellow-300",
//     Low: " bg-green-600 border-green-300",
//   };

//   const handleMetricsSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await updateMetrics(task._id, metrics);
//       alert("Metrics updated successfully!");
//       setShowMetricsForm(false);
//       onRefresh();
//     } catch (error) {
//       alert("Error updating metrics");
//     }
//   };

//   const handleStatusChange = async (status) => {
//     try {
//       const payload = {
//         status: status,
//       };
//       await updateTaskStatus(task._id, payload);
//       alert("Status updated!");
//       onRefresh();
//     } catch (error) {
//       alert("Error updating status");
//     }
//   };

//   return (
//     <div
//       draggable
//       onDragStart={() => onDragStart(task)}
//       className={`border-2 ${priorityColors[task.priority]} rounded-lg p-3
//       bg-white dark:bg-[#1e2533]
//       border-gray-200 dark:border-gray-700
//       hover:shadow-md transition-shadow`}
//     >
//       <div>
//         <div className="flex items-center justify-between ">
//           <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//             {task.requirement?.client?.clientName}
//           </p>

//           <span
//             className={`
//       text-xs text-white  px-2.5 py-0.5 rounded-full
//       ${priority[task.priority]}
//     `}
//           >
//             {task.priority}
//           </span>
//         </div>

//         <p className="text-sm text-gray-700 dark:text-gray-300 ">
//           {task.requirement?.techStack}
//         </p>

//         <p className="text-xs text-gray-900 dark:text-gray-200 mb-3">
//           {task.requirement?.requirementCode}
//         </p>

//         {/* Metrics */}
//         <div className="shadow rounded-md py-2 mb-3 text-xs bg-gray-100 dark:bg-[#202b3a]">
//           <div className="grid grid-cols-4 gap-2">
//             {[
//               { label: "Sourced", value: metrics?.profilesSourced || 0 },
//               { label: "Screened", value: metrics?.profilesScreened || 0 },
//               { label: "Submitted", value: metrics?.profilesSubmitted || 0 },
//               {
//                 label: "Accepted",
//                 value: metrics?.profilesAcceptedBySales || 0,
//               },
//             ].map((metric, idx) => (
//               <div
//                 key={idx}
//                 className="flex flex-col items-center text-gray-600 dark:text-gray-300"
//               >
//                 <span>{metric.label}</span>
//                 <span className="font-bold text-gray-900 dark:text-white">
//                   {metric.value}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Form to Update Metrics */}
//         {showMetricsForm ? (
//           <form
//             onSubmit={handleMetricsSubmit}
//             className="space-y-2"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {[
//               { key: "profilesSourced", placeholder: "Sourced" },
//               { key: "profilesScreened", placeholder: "Screened" },
//               { key: "profilesSubmitted", placeholder: "Submitted" },
//               { key: "profilesAcceptedBySales", placeholder: "Accepted" },
//               { key: "profilesSubmittedToClient", placeholder: "To Client" },
//             ].map((field, i) => (
//               <input
//                 key={i}
//                 type="number"
//                 placeholder={field.placeholder}
//                 value={metrics[field.key]}
//                 onChange={(e) =>
//                   setMetrics({
//                     ...metrics,
//                     [field.key]: parseInt(e.target.value) || 0,
//                   })
//                 }
//                 min="0"
//                 className="w-full border rounded py-1 px-2 text-sm
//             bg-white dark:bg-[#1e2738]
//             text-gray-900 dark:text-white
//             border-gray-300 dark:border-gray-600"
//               />
//             ))}

//             <div className="flex gap-2">
//               <button
//                 type="submit"
//                 className="flex-1 bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
//               >
//                 Save
//               </button>
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setShowMetricsForm(false);
//                 }}
//                 className="flex-1 bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         ) : (
//           <div className="space-y-2">
//             {/* Status Dropdown */}
//             <select
//               value={task.status}
//               onChange={(e) => {
//                 e.stopPropagation();
//                 handleStatusChange(e.target.value);
//               }}
//               className="w-full border rounded py-1 px-2 text-sm
//           bg-white dark:bg-[#1e2738]
//           text-gray-900 dark:text-white
//           border-gray-300 dark:border-gray-600"
//             >
//               <option value="Assigned">Assigned</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Completed">Completed</option>
//             </select>

//             {/* Buttons */}
//             <div className="grid grid-cols-3 gap-2">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setShowMetricsForm(true);
//                 }}
//                 className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
//               >
//                 Update
//               </button>
//               <button
//                 className="bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setShowQuickView(true);
//                 }}
//               >
//                 View
//               </button>
//               <button
//                 className="bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700"
//                 onClick={onClick}
//               >
//                 Action
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="flex justify-between  items-center mt-4">
//           <p className="text-xs text-gray-500 dark:text-gray-400">
//             {task.taskCode}
//           </p>
//           <p className="text-xs  text-gray-500 dark:text-gray-400">
//             Assigned by :{" "}
//             <span className="font-semibold">{task.assignedBy?.fullName}</span>
//           </p>
//         </div>

//         {/* Quick View Modal */}
//         {showQuickView && (
//           <TaskQuickViewModal
//             task={task}
//             onClose={() => setShowQuickView(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };
// export default TaskCard;

import React, { useState } from "react";
import Swal from "sweetalert2";
import TaskQuickViewModal from "../TaskManagement/TaskQuickViewModal";
import { updateMetrics, updateTaskStatus } from "../../services/taskServices";
import CustomSwal from "../../utils/CustomSwal";

const TaskCard = ({ task, onClick, onRefresh, onDragStart }) => {
  const [showMetricsForm, setShowMetricsForm] = useState(false);
  const [metrics, setMetrics] = useState(task.metrics);
  const [showQuickView, setShowQuickView] = useState(false);

  const priorityColors = {
    Critical: " text-red-800 border-red-500",
    High: " text-orange-800 border-red-300",
    Medium: " text-yellow-800 border-yellow-500",
    Low: " text-green-800 border-green-500",
  };
  const priority = {
    Critical: "bg-red-900  border-red-300",
    High: " bg-red-600 border-orange-300",
    Medium: " bg-yellow-600 border-yellow-300",
    Low: " bg-green-600 border-green-300",
  };

  const handleMetricsSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateMetrics(task._id, metrics);
      CustomSwal.fire({
        text: res?.message || "Task status updated successfully",
        icon: "success",
        showConfirmButton: true,
      });
      setShowMetricsForm(false);
      onRefresh();
    } catch (error) {
      CustomSwal.fire({
        text: error || "Failed to update task ",
        icon: "error",
        showConfirmButton: true,
      });
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const payload = {
        status: status,
      };
      const res = await updateTaskStatus(task._id, payload);
      CustomSwal.fire({
        text: res?.message || "Task status updated successfully",
        icon: "success",
        showConfirmButton: true,
      });
      onRefresh();
    } catch (error) {
      CustomSwal.fire({
        text: error || "Failed to update task ",
        icon: "error",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task)}
      className={`border-2 ${priorityColors[task.priority]} rounded-lg p-3
      bg-white dark:bg-[#1e2533]
      border-gray-200 dark:border-gray-700
      hover:shadow-md transition-shadow`}
    >
      <div>
        <div className="flex items-center justify-between ">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {task.requirement?.client?.clientName}
          </p>

          <span
            className={`
      text-xs text-white  px-2.5 py-0.5 rounded-full
      ${priority[task.priority]}
    `}
          >
            {task.priority}
          </span>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 ">
          {task.requirement?.techStack}
        </p>

        <p className="text-xs text-gray-900 dark:text-gray-200 mb-3">
          {task.requirement?.requirementCode}
        </p>

        {/* Metrics */}
        <div className="shadow rounded-md py-2 mb-3 text-xs bg-gray-100 dark:bg-[#202b3a]">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Sourced", value: metrics?.profilesSourced || 0 },
              { label: "Screened", value: metrics?.profilesScreened || 0 },
              { label: "Submitted", value: metrics?.profilesSubmitted || 0 },
              {
                label: "Accepted",
                value: metrics?.profilesAcceptedBySales || 0,
              },
            ].map((metric, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-gray-600 dark:text-gray-300"
              >
                <span>{metric.label}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form to Update Metrics */}
        {showMetricsForm ? (
          <form
            onSubmit={handleMetricsSubmit}
            className="space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            {[
              { key: "profilesSourced", placeholder: "Sourced" },
              { key: "profilesScreened", placeholder: "Screened" },
              { key: "profilesSubmitted", placeholder: "Submitted" },
              { key: "profilesAcceptedBySales", placeholder: "Accepted" },
              { key: "profilesSubmittedToClient", placeholder: "To Client" },
            ].map((field, i) => (
              <input
                key={i}
                type="number"
                placeholder={field.placeholder}
                value={metrics[field.key]}
                onChange={(e) =>
                  setMetrics({
                    ...metrics,
                    [field.key]: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                className="w-full border rounded py-1 px-2 text-sm
            bg-white dark:bg-[#1e2738]
            text-gray-900 dark:text-white
            border-gray-300 dark:border-gray-600"
              />
            ))}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMetricsForm(false);
                }}
                className="flex-1 bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            {/* Status Dropdown */}
            <select
              value={task.status}
              onChange={(e) => {
                e.stopPropagation();
                handleStatusChange(e.target.value);
              }}
              className="w-full border rounded py-1 px-2 text-sm
          bg-white dark:bg-[#1e2738]
          text-gray-900 dark:text-white
          border-gray-300 dark:border-gray-600"
            >
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMetricsForm(true);
                }}
                className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
              >
                Update
              </button>
              <button
                className="bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
              >
                View
              </button>
              <button
                className="bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700"
                onClick={onClick}
              >
                Action
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between  items-center mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {task.taskCode}
          </p>
          <p className="text-xs  text-gray-500 dark:text-gray-400">
            Assigned by :{" "}
            <span className="font-semibold">{task.assignedBy?.fullName}</span>
          </p>
        </div>

        {/* Quick View Modal */}
        {showQuickView && (
          <TaskQuickViewModal
            task={task}
            onClose={() => setShowQuickView(false)}
          />
        )}
      </div>
    </div>
  );
};
export default TaskCard;
