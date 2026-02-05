import CustomSwal from "./CustomSwal";

// Success alert
export const swalSuccess = (title = "Success", text = "") =>
  CustomSwal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "OK",
  });

// Error alert
export const swalError = (title = "Error", text = "") =>
  CustomSwal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "OK",
  });

// Warning alert
export const swalWarning = (title = "Warning", text = "") =>
  CustomSwal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonText: "OK",
  });

// Info alert
export const swalInfo = (title = "Info", text = "") =>
  CustomSwal.fire({
    icon: "info",
    title,
    text,
    confirmButtonText: "OK",
  });

export const swalLogoutConfirm = () =>
  CustomSwal.fire({
    title: "Log out of your account?",
    text: "You’ll be signed out and need to log in again to continue.",
    icon: "question",
    iconColor: "#dc2626",
    showCancelButton: true,
    confirmButtonText: "Yes, log me out",
    cancelButtonText: "Stay logged in",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
  });
