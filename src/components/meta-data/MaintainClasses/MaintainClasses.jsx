import React, { useState, useEffect, useRef } from "react";
import "../../../common/input-group.css";
import "../../../common/table.css";
import { toast } from "react-toastify";
import MaintainClassesResults from "./MaintainClassesResults.jsx";

import {
  displayErrorToast,
  updateToast,
} from "../../../common/toastHelpers.jsx";
import cardServiceImpl from "../../../services/CardService.jsx";
import { useFormik } from "formik";
import { heroClassSchema } from "../../../schemas/index.jsx";

export default function MaintainClasses({ cardService = cardServiceImpl }) {
  const [heroClasses, setHeroClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const addToastRef = useRef(null);
  const deleteToastRef = useRef(null);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
      },
      validationSchema: heroClassSchema,
      onSubmit,
    });

  useEffect(() => {
    fetchHeroClasses();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(values, actions) {
    addHeroClass(values, actions);
  }

  async function fetchHeroClasses() {
    setIsLoading(true);
    const { data, error } = await cardServiceImpl.fetchHeroClasses();

    if (error == null) {
      setHeroClasses(data);
      setIsLoading(false);
    } else {
      displayErrorToast(error);
    }
  }

  async function addHeroClass(values, actions) {
    addToastRef.current = toast("Adding record...");

    const { error } = await cardServiceImpl.addHeroClass(values);

    updateToast(addToastRef, error, true);

    if (error == null) {
      actions.resetForm();
      fetchHeroClasses();
    }
  }

  async function deleteHeroClass(e) {

    deleteToastRef.current = toast("Deleting record...");
    const { error } = await cardServiceImpl.deleteHeroClass(e.currentTarget.id);
    updateToast(deleteToastRef, error, true);

    if (error == null) {
      fetchHeroClasses();
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

      <MaintainClassesResults
        isLoading={isLoading}
        heroClasses={heroClasses}
        deleteHeroClass={deleteHeroClass}
      />
    </div>
  );
}
