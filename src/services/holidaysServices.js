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


