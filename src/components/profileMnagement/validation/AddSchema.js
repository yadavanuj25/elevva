import * as yup from "yup";
import { profileSchema } from "./ProfileSchema";

export const AddSchema = yup.object().shape({
  ...profileSchema,
  resume: profileSchema.resume.required("Resume is required"),
});
