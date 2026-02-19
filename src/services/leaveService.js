import { fetchHandler } from "../fatchHandler/fetchHandler";

export const getLeavesBalance = () => fetchHandler("/api/leaves/balance");
export const getPendingLeaves = () => fetchHandler("/api/leaves/pending");
export const getTeamLeaves = () => fetchHandler("/api/leaves/team");
export const getUpcomingLeaves = () => fetchHandler("/api/leaves/upcoming");
export const getLeaveStats = () => fetchHandler("/api/leaves/stats");
export const getMyLeaves = (filters = {}) => {
  const queryParams = new URLSearchParams({
    ...(filters.status && { status: filters.status }),
    ...(filters.leaveType && { leaveType: filters.leaveType }),
  }).toString();

  return fetchHandler(
    `/api/leaves/my-leaves${queryParams ? `?${queryParams}` : ""}`,
  );
};

export const applyLeaves = (formData) =>
  fetchHandler("/api/leaves/apply", "POST", formData);
export const approveLeaves = (id, comment) =>
  fetchHandler(`/api/leaves/${id}/approve`, "PUT", comment);
export const rejectLeaves = (id, reason) =>
  fetchHandler(`/api/leaves/${id}/reject`, "PUT", reason);
export const cancelLeaves = (id, reason) =>
  fetchHandler(`/api/leaves/${id}/cancel`, "PUT", reason);
