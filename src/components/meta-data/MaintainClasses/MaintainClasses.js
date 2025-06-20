import React, { useState, useEffect, useRef } from "react";
import "../../../common/input-group.css";
import "../../../common/table.css";
import { toast } from "react-toastify";
import MaintainClassesResults from "./MaintainClassesResults";
import { displayErrorToast, updateToast } from "../../../common/toastHelpers";
import cardServiceImpl from "../../../services/CardService";
import { useFormik } from "formik";
import { heroClassSchema } from "../../../schemas/index";
export default function MaintainClasses({ cardService = cardServiceImpl }) {
  const [heroClasses, setHeroClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const addToastRef = useRef(null);
  const deleteToastRef = useRef(null);
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
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
    const { data, error } = await cardService.fetchHeroClasses();
    if (error == null) {
      setHeroClasses(data);
      setIsLoading(false);
    } else {
      displayErrorToast(error);
    }
  }
  async function addHeroClass(values, actions) {
    addToastRef.current = toast("Adding record...");
    const { error } = await cardService.addHeroClass({
      ...values,
      id: 0, // temporary id, will be replaced by server
      created_at: new Date().toISOString(),
    });
    updateToast(addToastRef, error, true);
    if (error == null) {
      actions.resetForm();
      fetchHeroClasses();
    }
  }
  async function deleteHeroClass(e) {
    deleteToastRef.current = toast("Deleting record...");
    const { error } = await cardService.deleteHeroClass(Number(e.currentTarget.id));
    updateToast(deleteToastRef, error, true);
    if (error == null) {
      fetchHeroClasses();
    }
  }
  return React.createElement(
    "div",
    { className: "maintain-data" },
    React.createElement(
      "div",
      { className: "input-group" },
      React.createElement(
        "form",
        { onSubmit: handleSubmit, role: "form" },
        React.createElement(
          "div",
          { className: "form-control" },
          React.createElement("input", {
            placeholder: "Name",
            type: "text",
            id: "name",
            name: "name",
            value: values.name,
            onChange: handleChange,
            onBlur: handleBlur,
            className: errors.name && touched.name ? "error" : "",
          }),
          errors.name &&
            touched.name &&
            React.createElement("div", { className: "error-msg" }, errors.name)
        ),
        React.createElement("input", { type: "submit", value: "Submit" })
      )
    ),
    React.createElement(MaintainClassesResults, {
      isLoading: isLoading,
      heroClasses: heroClasses,
      deleteHeroClass: deleteHeroClass,
    })
  );
}
