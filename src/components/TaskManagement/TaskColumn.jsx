import React from "react";
import TaskCard from "./TaskCard";

const TaskColumn = ({ title, tasks, color, onTaskClick, onRefresh }) => {
  const colors = {
    yellow: "border-yellow-500",
    blue: "border-blue-500",
    green: "border-green-500",
  };

  return (
    <div className="bg-white dark:bg-[#31415f] rounded-lg shadow-md p-4">
      <h3 className={`text-lg font-bold mb-4 border-l-4 ${colors[color]} pl-3`}>
        {title} ({tasks.length})
      </h3>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tasks</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => onTaskClick(task)}
              onRefresh={onRefresh}
            />
          ))
        )}
      </div>
    </div>
  );
};
export default TaskColumn;
