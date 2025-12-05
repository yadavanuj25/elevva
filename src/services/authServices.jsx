import { fetchHandler } from "../fatchHandler/fetchHandler";

export const forgotPassword = (email) => {
  return fetchHandler(`api/auth/forgot-password`, "POST", {
    email,
  });
};

export const resetPassword = (token, password, confirmPassword) => {
  return fetchHandler(`/api/auth/reset-password/${token}`, "PUT", {
    password,
    confirmPassword,
  });
};
