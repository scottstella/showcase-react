import React, { useState, useEffect, useRef } from "react";
import "../../../common/input-group.css";
import "../../../common/table.css";
import { toast } from "react-toastify";
import MaintainTribesResults from "./MaintainTribesResults";
import { displayErrorToast, updateToast } from "../../../common/toastHelpers";
import cardServiceImpl from "../../../services/CardService";
import { useFormik, FormikHelpers } from "formik";
import { tribeSchema } from "../../../schemas/index";
import { Tribe } from "../../../dto/Tribe";

interface FormValues {
  name: string;
}

export default function MaintainTribes({
  cardService = cardServiceImpl,
}: {
  cardService?: typeof cardServiceImpl;
}) {
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const addToastRef = useRef<null | ToastId>(null);
  const deleteToastRef = useRef<null | ToastId>(null);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik<FormValues>({
      initialValues: {
        name: "",
      },
      validationSchema: tribeSchema,
      onSubmit,
    });

  useEffect(() => {
    fetchTribes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) {
    addTribe(values, actions);
  }

  async function fetchTribes() {
    setIsLoading(true);
    const { data, error } = await cardService.fetchTribes();

    if (error == null) {
      setTribes(data);
      setIsLoading(false);
    } else {
      displayErrorToast(error);
    }
  }

  async function addTribe(
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) {
    addToastRef.current = toast("Adding record...");

    const { error } = await cardService.addTribe(values);

    updateToast(addToastRef, error, true);

    if (error == null) {
      actions.resetForm();
      fetchTribes();
    }
  }

  async function deleteTribe(e: React.MouseEvent<HTMLElement>) {
    deleteToastRef.current = toast("Deleting record...");
    const { error } = await cardService.deleteTribe(e.currentTarget.id);
    updateToast(deleteToastRef, error, true);

    if (error == null) {
      fetchTribes();
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="input-group">
        <input
          placeholder="Name"
          type="text"
          id="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.name && touched.name ? "error" : ""}
        />
        {errors.name && touched.name && (
          <div className="error-msg">{errors.name}</div>
        )}
        <input type="submit" />
      </form>

      <MaintainTribesResults
        isLoading={isLoading}
        tribes={tribes}
        deleteTribe={deleteTribe}
      />
    </div>
  );
}
