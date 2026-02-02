import * as yup from "yup";

export const shiftSchema = yup.object({
  name: yup.string().required("Shift name is required"),
  timezone: yup.string().required("Timezone is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),

  workingDays: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one working day"),

  breakTime: yup.object({
    duration: yup
      .number()
      .typeError("Break duration must be a number")
      .required("Break duration is required")
      .min(30, "Minimum 30 minutes"),
    isPaid: yup.boolean(),
  }),

  graceTime: yup
    .number()
    .typeError("Grace time must be a number")
    .min(0)
    .required(),

  halfDayHours: yup.number().moreThan(0).required(),
  fullDayHours: yup.number().moreThan(0).required(),

  overtimeEnabled: yup.boolean(),

  overtimeRate: yup.number().when("overtimeEnabled", {
    is: true,
    then: (s) => s.required().min(1),
    otherwise: (s) => s.nullable(),
  }),

  color: yup.string().required(),
});
