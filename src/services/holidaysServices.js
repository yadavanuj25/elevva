import { fetchHandler } from "../fatchHandler/fetchHandler";

export const addHolidays = (formdata) =>
  fetchHandler("/api/holidays", "POST", formdata);

export const addBulkHolidays = (formdata) =>
  fetchHandler("/api/holidays/admin/bulk", "POST", formdata);

export const updateHolidays = (id, formdata) =>
  fetchHandler(`/api/holidays/${id}`, "PUT", formdata);

export const deleteHolidays = (id) =>
  fetchHandler(`/api/holidays/${id}`, "DELETE");

export const getStats = () => fetchHandler("/api/holidays/admin/stats");

export const getAttendanceHistory = ({
  startDate,
  endDate,
  page = 1,
  limit = 30,
}) => {
  const queryParams = new URLSearchParams({
    startDate,
    endDate,
    page,
    limit,
  }).toString();

  return fetchHandler(`/api/attendance/history?${queryParams}`, "GET");
};

export const getAllUsersAttendance = ({
  startDate,
  endDate,
  department,
  limit = 1000,
}) => {
  const queryParams = new URLSearchParams({
    startDate,
    endDate,
    department,
    limit,
  }).toString();

  return fetchHandler(`/api/attendance/history?${queryParams}`, "GET");
};
