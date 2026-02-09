import { toast } from "react-toastify";

export const toastSuccess = (message) => toast.success(message || "Success");

export const toastError = (message) =>
  toast.error(message || "Something went wrong");

export const toastWarning = (message) => toast.warn(message);

export const toastInfo = (message) => toast.info(message);
