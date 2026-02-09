import * as yup from "yup";

export const shiftSchema = yup.object({
  name: yup.string().required("Shift name is required"),
  timezone: yup.string().required("Timezone is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  workingDays: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one working day")
    .required("Working days are required"),
  breakTime: yup.object({
    duration: yup
      .number()
      .typeError("Break duration must be a number")
      .required("Break duration is required")
      .min(30, "Break duration must be at least 30 minutes"),
    isPaid: yup.boolean().notRequired(),
  }),
  graceTime: yup
    .number()
    .typeError("Grace time must be a number")
    .min(0, "Grace time cannot be negative")
    .required("Grace time is required"),
  halfDayHours: yup
    .number()
    .typeError("Half day hours must be a number")
    .required("Half day hours is required")
    .moreThan(0, "Half day hours must be greater than 0"),
  fullDayHours: yup
    .number()
    .typeError("Full day hours must be a number")
    .required("Full day hours is required")
    .moreThan(0, "Full day hours must be greater than 0"),
  overtimeEnabled: yup.boolean(),
  overtimeRate: yup.number().when("overtimeEnabled", {
    is: true,
    then: (schema) =>
      schema
        .typeError("Overtime rate must be a number")
        .required("Overtime rate is required")
        .min(0.01, "Overtime rate must be greater than 0"),
    otherwise: (schema) => schema.notRequired(),
  }),
  color: yup.string().required("Shift color is required"),
});
