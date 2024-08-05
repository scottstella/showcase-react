import React, { useState, useEffect, useRef } from "react";
import "../../../common/input-group.css";
import "../../../common/table.css";
import { toast } from "react-toastify";
import MaintainTribesResults from "./MaintainTribesResults.jsx";

import {
  displayErrorToast,
  updateToast,
} from "../../../common/toastHelpers.jsx";
import cardServiceImpl from "../../../services/CardService.jsx";
import { useFormik } from "formik";
import { tribeSchema } from "../../../schemas/index.jsx";

export default function MaintainTribes({ cardService = cardServiceImpl }) {
  const [tribes, setTribes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const addToastRef = useRef(null);
  const deleteToastRef = useRef(null);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
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

  function onSubmit(values, actions) {
    addTribe(values, actions);
  }

  async function fetchTribes() {
    setIsLoading(true);
    const { data, error } = await cardServiceImpl.fetchTribes();

    if (error == null) {
      setTribes(data);
      setIsLoading(false);
    } else {
      displayErrorToast(error);
    }
  }

  async function addTribe(values, actions) {
    addToastRef.current = toast("Adding record...");

    const { error } = await cardServiceImpl.addTribe(values);

    updateToast(addToastRef, error, true);

    if (error == null) {
      actions.resetForm();
      fetchTribes();
    }
  }

  async function deleteTribe(e) {
    deleteToastRef.current = toast("Deleting record...");
    const { error } = await cardServiceImpl.deleteTribe(e.currentTarget.id);
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
