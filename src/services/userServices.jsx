import { fetchHandler } from "../fatchHandler/fetchHandler";

export const getAllUsers = (page = 1, limit = 5, tab = "All", search = "") => {
  let url = `/api/users?page=${page}&limit=${limit}`;
  if (tab.toLowerCase() === "active") url += "&status=active";
  if (tab.toLowerCase() === "inactive") url += "&status=inactive";
  if (search.trim() !== "") url += `&search=${encodeURIComponent(search)}`;
  return fetchHandler(url);
};

export const getUserById = (id) => fetchHandler(`/api/users/${id}`);

export const createUser = (userData) =>
  fetchHandler("/api/auth/register", "POST", userData);

export const updateUser = (id, userData) =>
  fetchHandler(`/api/users/${id}`, "PUT", userData);

export const updateUserStatus = (id, status) => {
  return fetchHandler(`/api/users/${id}`, "PUT", status);
};
