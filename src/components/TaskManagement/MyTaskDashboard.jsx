import React, { useState, useEffect } from "react";
import { ListTodo, UserCheck, BarChart3, Send } from "lucide-react";
import PageTitle from "../../hooks/PageTitle";
import MyTasksDashboard from "./MyTasksDashboard";
import TaskReportView from "./TaskReportView";
import AllTasksView from "./AllTasksView";
import AssignTaskView from "./AssignTaskView";

// Main App Component
const MyTaskDashboard = () => {
  PageTitle("Elevva | Tasks");
  const [currentView, setCurrentView] = useState("my-tasks");
  const [userRole, setUserRole] = useState("hr");

  useEffect(() => {
    // Check user role from localStorage or API
    const role = localStorage.getItem("userRole") || "hr";
    setUserRole(role);
  }, []);

  return (
    <div className="min-h-screen ">
      {/* Navigation */}
      <nav className=" rounded-lg mb-6">
        <div className=" mx-auto">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h2>Task Management</h2>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView("my-tasks")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  currentView === "my-tasks"
                    ? "bg-accent-dark text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <UserCheck size={16} />
                My Tasks
              </button>
              {/* {userRole === "manager" && ( */}
              <>
                <button
                  onClick={() => setCurrentView("all-tasks")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    currentView === "all-tasks"
                      ? "bg-accent-dark text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <ListTodo size={16} />
                  All Tasks
                </button>
                <button
                  onClick={() => setCurrentView("assign-task")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    currentView === "assign-task"
                      ? "bg-accent-dark text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <Send size={16} />
                  Assign Task
                </button>
                <button
                  onClick={() => setCurrentView("report")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    currentView === "report"
                      ? "bg-accent-dark text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <BarChart3 size={16} />
                  Reports
                </button>
              </>
              {/* )} */}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className=" ">
        {currentView === "my-tasks" && <MyTasksDashboard />}
        {currentView === "all-tasks" && <AllTasksView />}
        {currentView === "assign-task" && <AssignTaskView />}
        {currentView === "report" && <TaskReportView />}
      </div>
    </div>
  );
};

// My Tasks Dashboard Component
<MyTasksDashboard />;

// All Tasks View
<AllTasksView />;

// Assign Task View
<AssignTaskView />;

// Task Report View
<TaskReportView />;

export default MyTaskDashboard;
