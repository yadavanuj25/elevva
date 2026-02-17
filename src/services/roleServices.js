import { fetchHandler } from "../fatchHandler/fetchHandler";

export const getRoles = () => fetchHandler("/api/roles");
export const getAllPermissions = () =>
  fetchHandler("/api/roles/permissions/all");
export const addRoles = (formdata) =>
  fetchHandler("/api/roles", "POST", formdata);

export const getRoleById = (id) => fetchHandler(`/api/roles/${id}`);

export const editRoles = (id, formdata) =>
  fetchHandler(`/api/roles/${id}`, "PUT", formdata);
