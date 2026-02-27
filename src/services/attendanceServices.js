import { fetchHandler } from "../fatchHandler/fetchHandler";

export const punchIn = (formdata) =>
  fetchHandler("/api/attendance/punch-in", "POST", formdata);

export const punchOut = (formdata) =>
  fetchHandler("/api/attendance/punch-out", "POST", formdata);

export const startBreak = (formdata) =>
  fetchHandler("/api/attendance/break-start", "POST", formdata);

export const endBreak = (formdata) =>
  fetchHandler("/api/attendance/break-end", "POST", formdata);

export const getTodayAttendance = () => fetchHandler("/api/attendance/today");

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
  return fetchHandler(`/api/attendance/attendance-all?${queryParams}`, "GET");
};
