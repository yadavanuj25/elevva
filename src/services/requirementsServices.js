import { fetchHandler } from "../fatchHandler/fetchHandler";

export const getRequirementStats = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.userId) params.append("userId", filters.userId);
  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.workMode) params.append("workMode", filters.workMode);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);

  return fetchHandler(`/api/requirements/stats?${params.toString()}`);
};
