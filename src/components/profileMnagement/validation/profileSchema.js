import * as yup from "yup";

// export const phoneSchema = yup
//   .string()
//   .transform((value) => (value === "" ? null : value))
//   .matches(/^[0-9]+$/, "Phone must contain only numbers")
//   .min(10, "Phone must be at least 10 digits")
//   .max(15, "Phone must be at most 15 digits");
export const phoneSchema = yup
  .string()
  .nullable()
  .transform((value) => (value === "" ? null : value))
  .matches(/^[0-9]+$/, {
    message: "Phone must contain only numbers",
    excludeEmptyString: true,
  })
  .min(10, "Phone must be at least 10 digits")
  .max(15, "Phone must be at most 15 digits");

export const profileSchema = {
  resume: yup
    .mixed()
    .test("fileType", "Only PDF files allowed", (value) => {
      return !value || value.type === "application/pdf";
    })
    .test("fileSize", "File size must be less than 20 MB", (value) => {
      return !value || value.size <= 20 * 1024 * 1024;
    }),

  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: phoneSchema.required("Phone is required"),
  // alternatePhone: phoneSchema.notRequired(),
  alternatePhone: phoneSchema.nullable().notRequired(),
  preferredLocation: yup.string().required("Preferred location is required"),
  currentLocation: yup.string().required("Current location is required"),
  currentCompany: yup.string().required("Current company is required"),
  totalExp: yup.string().required("Total experience is required"),
  currentCTC: yup.string().required("Current CTC is required"),
  expectedCTC: yup.string().required("Expected CTC is required"),
  workMode: yup.string().required("Work mode is required"),
  noticePeriod: yup.string().required("Notice period is required"),
  status: yup.string().required("Candidate status is required"),
  techStack: yup.string().required("Tech stack is required"),
  candidateSource: yup.string().required("Candidate source is required"),
  skills: yup.array().min(8, "Add at least 8 skill"),
  description: yup.string().nullable(),
};
