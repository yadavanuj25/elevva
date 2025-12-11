import React, { useState, useEffect } from "react";
import { getMyTasks } from "../../services/taskServices";
import SummaryCard from "../TaskManagement/SummaryCard.jsx";
import TaskColumn from "../TaskManagement/TaskColumn.jsx";
import TaskDetailModal from "./TaskDetailModal.jsx";

const MyTasksDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const response = await getMyTasks();
      setTasks(response.tasks);
      setGroupedTasks(response.groupedTasks);
      setSummary(response.summary);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Error loading tasks");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total Tasks" count={summary.total} color="blue" />
        <SummaryCard title="Assigned" count={summary.assigned} color="yellow" />
        <SummaryCard
          title="In Progress"
          count={summary.inProgress}
          color="purple"
        />
        <SummaryCard
          title="Completed"
          count={summary.completed}
          color="green"
        />
      </div>

      {/* Task Columns (Kanban Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <TaskColumn
          title="Assigned"
          tasks={groupedTasks.assigned || []}
          color="yellow"
          onTaskClick={setSelectedTask}
          onRefresh={fetchMyTasks}
        />
        <TaskColumn
          title="In Progress"
          tasks={groupedTasks.inProgress || []}
          color="blue"
          onTaskClick={setSelectedTask}
          onRefresh={fetchMyTasks}
        />
        <TaskColumn
          title="Completed"
          tasks={groupedTasks.completed || []}
          color="green"
          onTaskClick={setSelectedTask}
          onRefresh={fetchMyTasks}
        />
      </div>

      {/* Task Detail Modal */}
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
