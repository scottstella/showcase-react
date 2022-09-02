import * as yup from "yup";

export const heroClassSchema = yup.object().shape({
  name: yup.string().required("Required"),
});
