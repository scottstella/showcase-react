import React, { useState, useEffect, useRef } from "react";
import "../../../common/input-group.css";
import "../../../common/table.css";
import { toast, Id } from "react-toastify";
import MaintainTribesResults from "./MaintainTribesResults";
import { displayErrorToast, updateToast } from "../../../common/toastHelpers";
import cardServiceImpl from "../../../services/CardService";
import { useFormik, FormikHelpers } from "formik";
import { tribeSchema } from "../../../schemas/index";
import type { Tribe } from "../../../dto/Tribe";

interface FormValues {
  name: string;
}

export default function MaintainTribes({
  cardService = cardServiceImpl,
}: {
  cardService?: typeof cardServiceImpl;
}) {
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const addToastRef = useRef<Id | null>(null);
  const deleteToastRef = useRef<Id | null>(null);

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

  function onSubmit(values: FormValues, actions: FormikHelpers<FormValues>) {
    addTribe(values, actions);
  }

  async function fetchTribes() {
    setIsLoading(true);
    const { data, error } = await cardService.fetchTribes();

    if (error == null) {
      setTribes(data as Tribe[]);
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

    const { error } = await cardService.addTribe({
      ...values,
      id: 0, // temporary id, will be replaced by server
      created_at: new Date().toISOString(),
    });

    updateToast(addToastRef, error, true);

    if (error == null) {
      actions.resetForm();
      fetchTribes();
    }
  }

  async function deleteTribe(e: React.MouseEvent<SVGSVGElement>) {
    deleteToastRef.current = toast("Deleting record...");
    const { error } = await cardService.deleteTribe(Number(e.currentTarget.id));
    updateToast(deleteToastRef, error, true);

    if (error == null) {
      fetchTribes();
    }
  }

  return (
    <div className="maintain-data">
      <div className="input-group">
        <form onSubmit={handleSubmit} role="form">
          <div className="form-control">
            <input
              placeholder="Name"
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name && touched.name ? "error" : ""}
            />
            {errors.name && touched.name && (
              <div className="error-msg">{errors.name}</div>
            )}
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>

      <MaintainTribesResults
        isLoading={isLoading}
        tribes={tribes}
        deleteTribe={deleteTribe}
      />
    </div>
  );
}
