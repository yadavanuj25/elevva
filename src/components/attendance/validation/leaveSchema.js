import * as yup from "yup";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const leaveSchema = yup.object({
  leaveType: yup.string().required("Leave type is required"),

  leaveDuration: yup.string().required("Leave duration is required"),

  fromDate: yup
    .date()
    .typeError("Invalid date")
    .min(today, "From date cannot be in the past")
    .required("From date is required"),

  toDate: yup
    .date()
    .typeError("Invalid date")
    .min(yup.ref("fromDate"), "To date cannot be before From date")
    .required("To date is required"),

  reason: yup
    .string()
    .min(10, "Reason must be at least 10 characters")
    .required("Reason is required"),

  contactNumber: yup
    .string()
    .nullable()
    .matches(/^[0-9]{10}$/, "Enter valid contact number"),

  attachment: yup
    .mixed()
    .nullable()
    .test(
      "fileSize",
      "File size is too large (Max 5MB)",
      (file) => !file || file.size <= 5 * 1024 * 1024
    )
    .test(
      "fileType",
      "Unsupported file format",
      (file) =>
        !file ||
        ["application/pdf", "image/jpeg", "image/png"].includes(file.type)
    ),
});
