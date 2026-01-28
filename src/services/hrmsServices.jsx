import { fetchHandler } from "../fatchHandler/fetchHandler";

export const getShift = () => fetchHandler("/api/shifts");

export const getShiftById = (id) => fetchHandler(`/api/shifts/${id}`);

export const createShift = (formdata) =>
  fetchHandler("/api/shifts", "POST", formdata);

export const updateShift = (id, formdata) =>
  fetchHandler(`/api/shifts/${id}`, "PUT", formdata);
