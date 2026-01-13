import * as yup from "yup";
import { profileSchema } from "./profileSchema";

export const EditSchema = yup.object().shape({
  ...profileSchema,
  resume: profileSchema.resume.nullable(),
});
