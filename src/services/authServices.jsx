import { fetchHandler } from "../fatchHandler/fetchHandler";

export const logoutUser = () => {
  return fetchHandler("/api/auth/login");
};
export const loginUser = (formData) => {
  return fetchHandler(`/api/auth/login`, "POST", {
    formData,
  });
};

export const forgotPassword = (email) => {
  return fetchHandler(`/api/auth/forgot-password`, "POST", {
    email,
  });
};

export const resetPassword = (token, password, confirmPassword) => {
  return fetchHandler(`/api/auth/reset-password/${token}`, "PUT", {
    password,
    confirmPassword,
  });
};
