import { fetchHandler } from "../fatchHandler/fetchHandler";

export const getAllTasks = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);
  return fetchHandler(`/api/tasks?${params.toString()}`, "GET");
};

export const getMyTasks = () => fetchHandler(`/api/tasks/my-tasks`);

export const updateMetrics = (id, taskData) =>
  fetchHandler(`/api/tasks/${id}/metrics`, "PUT", taskData);

export const updateTaskStatus = (id, status) => {
  return fetchHandler(`/api/tasks/${id}/status`, "PUT", status);
};

export const addTaskFeedback = (id, feedback) =>
  fetchHandler(`/api/tasks/${id}/feedback`, "POST", feedback);

export const addTaskRejection = (id, rejection) =>
  fetchHandler(`/api/tasks/${id}/rejection`, "POST", rejection);

export const assignTask = (formData) =>
  fetchHandler(`/api/tasks/assign`, "POST", formData);

export const getOpenRequirements = () => {
  return fetchHandler("/api/requirements?status=Open");
};

export const getUsers = () => {
  return fetchHandler("/api/users");
};

export const getTasksReport = (query = "") =>
  fetchHandler(`/api/tasks/report${query ? `?${query}` : ""}`);
