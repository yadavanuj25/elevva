import { fetchHandler } from "../fatchHandler/fetchHandler";

export const loginUser = (formData) => {
  return fetchHandler(`/api/auth/login`, "POST", formData);
};

export const logoutUser = () => {
  return fetchHandler("/api/auth/logout", "POST");
};

export const getMe = () => {
  return fetchHandler("/api/auth/me");
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
