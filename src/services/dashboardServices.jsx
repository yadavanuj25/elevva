import { fetchHandler } from "../fatchHandler/fetchHandler";

export const getAdminDashboard = () =>
  fetchHandler("/api/dashboard/admin", "GET");

export const getSalesDashboard = () =>
  fetchHandler("/api/dashboard/sales", "GET");

export const getHRDashboard = () => fetchHandler("/api/dashboard/hr", "GET");

export const getRecruiterDashboard = () =>
  fetchHandler("/api/dashboard/recruiter", "GET");

export const getEmployeeDashboard = () =>
  fetchHandler("/api/dashboard/employee", "GET");
