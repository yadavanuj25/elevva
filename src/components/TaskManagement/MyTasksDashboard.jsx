import React, { useState, useEffect } from "react";
import { getMyTasks } from "../../services/taskServices";
import SummaryCard from "../TaskManagement/SummaryCard.jsx";
import TaskColumn from "../TaskManagement/TaskColumn.jsx";
import TaskDetailModal from "./TaskDetailModal.jsx";
import { BarLoader } from "react-spinners";
import { Activity } from "lucide-react";

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
      <div className="h-[70vh] flex justify-center items-center text-center py-10">
        <div className="w-[200px] text-black dark:text-white bg-gray-300 dark:bg-gray-700 rounded-full">
          <BarLoader
            height={6}
            width={200}
            color="currentColor"
            cssOverride={{ borderRadius: "999px" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
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
