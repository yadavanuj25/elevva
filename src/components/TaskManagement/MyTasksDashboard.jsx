
import React, { useState, useEffect } from "react";
import { getMyTasks, updateTaskStatus } from "../../services/taskServices";
import PageTitle from "../../hooks/PageTitle.jsx";
import SummaryCard from "../TaskManagement/SummaryCard.jsx";
import TaskColumn from "../TaskManagement/TaskColumn.jsx";
import TaskDetailModal from "./TaskDetailModal.jsx";
import { BarLoader } from "react-spinners";
import CustomSwal from "../../utils/CustomSwal.jsx";

const MyTasksDashboard = () => {
  PageTitle("Elevva | Tasks");
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
