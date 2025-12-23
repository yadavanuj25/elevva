// import React, { useState, useEffect } from "react";
// import { getMyTasks } from "../../services/taskServices";
// import SummaryCard from "../TaskManagement/SummaryCard.jsx";
// import TaskColumn from "../TaskManagement/TaskColumn.jsx";
// import TaskDetailModal from "./TaskDetailModal.jsx";
// import { BarLoader } from "react-spinners";

// const MyTasksDashboard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [groupedTasks, setGroupedTasks] = useState({});
//   const [summary, setSummary] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [selectedTask, setSelectedTask] = useState(null);

//   useEffect(() => {
//     fetchMyTasks();
//   }, []);

//   const fetchMyTasks = async () => {
//     try {
//       setLoading(true);
//       const response = await getMyTasks();
//       setTasks(response.tasks);
//       setGroupedTasks(response.groupedTasks);
//       setSummary(response.summary);
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//       alert("Error loading tasks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="h-[70vh] flex justify-center items-center text-center py-10">
//         <div className="w-[200px] text-black dark:text-white bg-gray-300 dark:bg-gray-700 rounded-full">
//           <BarLoader
//             height={6}
//             width={200}
//             color="currentColor"
//             cssOverride={{ borderRadius: "999px" }}
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
//         <SummaryCard
//           title="Total Tasks"
//           count={summary.total}
//           color="blue"
//           icon="tasks"
//         />
//         <SummaryCard
//           title="Assigned"
//           count={summary.assigned}
//           color="yellow"
//           icon="assigned"
//         />
//         <SummaryCard
//           title="In Progress"
//           count={summary.inProgress}
//           color="purple"
//           icon="inprogress"
//         />
//         <SummaryCard
//           title="Completed"
//           count={summary.completed}
//           color="green"
//           icon="completed"
//         />
//       </div>

//       {/* Task Columns (Kanban Style) */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//         <TaskColumn
//           title="Assigned"
//           tasks={groupedTasks.assigned || []}
//           color="yellow"
//           onTaskClick={setSelectedTask}
//           onRefresh={fetchMyTasks}
//         />
//         <TaskColumn
//           title="In Progress"
//           tasks={groupedTasks.inProgress || []}
//           color="blue"
//           onTaskClick={setSelectedTask}
//           onRefresh={fetchMyTasks}
//         />
//         <TaskColumn
//           title="Completed"
//           tasks={groupedTasks.completed || []}
//           color="green"
//           onTaskClick={setSelectedTask}
//           onRefresh={fetchMyTasks}
//         />
//       </div>

//       {/* Task Detail Modal */}
//       {selectedTask && (
//         <TaskDetailModal
//           task={selectedTask}
//           onClose={() => setSelectedTask(null)}
//           onRefresh={fetchMyTasks}
//         />
//       )}
//     </div>
//   );
// };

// export default MyTasksDashboard;

// import React, { useState, useEffect } from "react";
// import { getMyTasks, updateTaskStatus } from "../../services/taskServices";
// import SummaryCard from "../TaskManagement/SummaryCard.jsx";
// import TaskColumn from "../TaskManagement/TaskColumn.jsx";
// import TaskDetailModal from "./TaskDetailModal.jsx";
// import { BarLoader } from "react-spinners";
// import { useMessage } from "../../auth/MessageContext.jsx";

// const MyTasksDashboard = () => {
//   const { showError, errorMsg, successMsg } = useMessage();
//   const [tasks, setTasks] = useState([]);
//   const [groupedTasks, setGroupedTasks] = useState({});
//   const [summary, setSummary] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [draggedTask, setDraggedTask] = useState(null);

//   useEffect(() => {
//     fetchMyTasks();
//   }, []);

//   const fetchMyTasks = async () => {
//     try {
//       setLoading(true);
//       const response = await getMyTasks();
//       setTasks(response.tasks);
//       setGroupedTasks(response.groupedTasks);
//       setSummary(response.summary);
//     } catch (error) {
//       showError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statusKeyMap = {
//     Assigned: "assigned",
//     "In Progress": "inProgress",
//     Completed: "completed",
//   };

//   const handleDragStart = (task) => {
//     setDraggedTask(task);
//   };

//   const handleDrop = async (newStatus) => {
//     if (!draggedTask || draggedTask.status === newStatus) {
//       setDraggedTask(null);
//       return;
//     }
//     try {
//       await updateTaskStatus(draggedTask._id, { status: newStatus });
//       const oldKey = statusKeyMap[draggedTask.status];
//       const newKey = statusKeyMap[newStatus];
//       const updatedGrouped = { ...groupedTasks };
//       updatedGrouped[oldKey] = updatedGrouped[oldKey].filter(
//         (t) => t._id !== draggedTask._id
//       );
//       updatedGrouped[newKey] = [
//         ...(updatedGrouped[newKey] || []),
//         updateTaskStatus,
//       ];
//       setGroupedTasks(updatedGrouped);
//       setSummary((prev) => ({
//         ...prev,
//         [oldKey]: prev[oldKey] - 1,
//         [newKey]: prev[newKey] + 1,
//       }));
//       fetchMyTasks();
//       setDraggedTask(null);
//     } catch (error) {
//       showError(error);
//       setDraggedTask(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="h-[70vh] flex justify-center items-center">
//         <div className="w-[200px] bg-gray-300 dark:bg-gray-700 rounded-full">
//           <BarLoader height={6} width={200} color="currentColor" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {errorMsg && (
//         <div
//           className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300
//                bg-red-50 text-red-700 shadow-sm animate-slideDown"
//         >
//           <span className=" font-semibold">⚠ {"  "}</span>
//           <p className="text-sm">{errorMsg}</p>
//         </div>
//       )}

//       {successMsg && (
//         <div
//           className="mb-4 flex items-center justify-center p-3 rounded-xl border border-green-300
//                bg-[#28a745] text-white shadow-sm animate-slideDown"
//         >
//           <span className=" font-semibold">✔ </span>
//           <p className="text-sm">{successMsg}</p>
//         </div>
//       )}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
//         <SummaryCard title="Total Tasks" count={summary.total} color="blue" />
//         <SummaryCard title="Assigned" count={summary.assigned} color="yellow" />
//         <SummaryCard
//           title="In Progress"
//           count={summary.inProgress}
//           color="purple"
//         />
//         <SummaryCard
//           title="Completed"
//           count={summary.completed}
//           color="green"
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//         <TaskColumn
//           title="Assigned"
//           tasks={groupedTasks.assigned || []}
//           color="yellow"
//           status="Assigned"
//           onTaskClick={setSelectedTask}
//           onDragStart={handleDragStart}
//           onDrop={handleDrop}
//           onRefresh={fetchMyTasks}
//         />

//         <TaskColumn
//           title="In Progress"
//           tasks={groupedTasks.inProgress || []}
//           color="blue"
//           status="In Progress"
//           onTaskClick={setSelectedTask}
//           onDragStart={handleDragStart}
//           onDrop={handleDrop}
//           onRefresh={fetchMyTasks}
//         />

//         <TaskColumn
//           title="Completed"
//           tasks={groupedTasks.completed || []}
//           color="green"
//           status="Completed"
//           onTaskClick={setSelectedTask}
//           onDragStart={handleDragStart}
//           onDrop={handleDrop}
//           onRefresh={fetchMyTasks}
//         />
//       </div>

//       {selectedTask && (
//         <TaskDetailModal
//           task={selectedTask}
//           onClose={() => setSelectedTask(null)}
//           onRefresh={fetchMyTasks}
//         />
//       )}
//     </div>
//   );
// };
// export default MyTasksDashboard;

import React, { useState, useEffect } from "react";
import { getMyTasks, updateTaskStatus } from "../../services/taskServices";
import SummaryCard from "../TaskManagement/SummaryCard.jsx";
import TaskColumn from "../TaskManagement/TaskColumn.jsx";
import TaskDetailModal from "./TaskDetailModal.jsx";
import { BarLoader } from "react-spinners";
import CustomSwal from "../../utils/CustomSwal.jsx";

const MyTasksDashboard = () => {
  const [groupedTasks, setGroupedTasks] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const res = await getMyTasks();
      setGroupedTasks(res.groupedTasks);
      setSummary(res.summary);
    } catch (err) {
      CustomSwal.fire({
        text: err.message || "Failed fetch tasks ",
        icon: "error",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const statusKeyMap = {
    Assigned: "assigned",
    "In Progress": "inProgress",
    Completed: "completed",
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = async (newStatus) => {
    if (!draggedTask || draggedTask.status === newStatus) return;

    const oldKey = statusKeyMap[draggedTask.status];
    const newKey = statusKeyMap[newStatus];

    try {
      const res = await updateTaskStatus(draggedTask._id, {
        status: newStatus,
      });

      CustomSwal.fire({
        text: res?.message || "Task status updated successfully",
        icon: "success",
        showConfirmButton: true,
      });

      setGroupedTasks((prev) => {
        const updated = { ...prev };
        updated[oldKey] = updated[oldKey].filter(
          (t) => t._id !== draggedTask._id
        );
        updated[newKey] = [
          ...(updated[newKey] || []),
          { ...draggedTask, status: newStatus },
        ];
        return updated;
      });

      setSummary((prev) => ({
        ...prev,
        [oldKey]: prev[oldKey] - 1,
        [newKey]: prev[newKey] + 1,
      }));
    } catch (err) {
      CustomSwal.fire({
        text: err || "Failed to update task ",
        icon: "error",
        showConfirmButton: true,
      });
    } finally {
      setDraggedTask(null);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex justify-center items-center">
        <BarLoader width={200} height={6} />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
        <SummaryCard
          title="Total Tasks"
          count={summary.total}
          color="blue"
          icon="tasks"
        />
        <SummaryCard
          title="Assigned"
          count={summary.assigned}
          color="yellow"
          icon="assigned"
        />
        <SummaryCard
          title="In Progress"
          count={summary.inProgress}
          color="purple"
          icon="inprogress"
        />
        <SummaryCard
          title="Completed"
          count={summary.completed}
          color="green"
          icon="completed"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {["Assigned", "In Progress", "Completed"].map((status) => (
          <TaskColumn
            key={status}
            title={status}
            status={status}
            tasks={groupedTasks[statusKeyMap[status]] || []}
            onTaskClick={setSelectedTask}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onRefresh={fetchMyTasks}
          />
        ))}
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onRefresh={fetchMyTasks}
        />
      )}
    </div>
  );
};

export default MyTasksDashboard;
