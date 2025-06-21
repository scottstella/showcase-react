import * as yup from "yup";

export const heroClassSchema = yup.object().shape({
  name: yup.string().trim().required("Name is required"),
});

export const tribeSchema = yup.object().shape({
  name: yup.string().trim().required("Name is required"),
});

export const setSchema = yup.object().shape({
  name: yup.string().trim().required("Name is required"),
  is_standard: yup.boolean().required("Standard set status is required"),
  release_date: yup.date().required("Release date is required"),
});
