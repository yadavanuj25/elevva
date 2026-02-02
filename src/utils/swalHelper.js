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
