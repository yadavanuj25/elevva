import * as yup from "yup";
import { profileSchema } from "./ProfileSchema";

export const EditSchema = yup.object().shape({
  ...profileSchema,
  resume: profileSchema.resume.nullable(),
});
