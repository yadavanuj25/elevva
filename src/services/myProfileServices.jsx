import { fetchHandler } from "../fatchHandler/fetchHandler";

export const updateProfile = (id, formdata) =>
  fetchHandler(`/api/users/${id}`, "PUT", formdata);

export const getMyProfile = () => fetchHandler("/api/myprofile");
