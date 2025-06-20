import React, { useState, useEffect, useRef } from "react";
import "../../../common/input-group.css";
import "../../../common/table.css";
import { toast } from "react-toastify";
import MaintainTribesResults from "./MaintainTribesResults";
import { displayErrorToast, updateToast } from "../../../common/toastHelpers";
import cardServiceImpl from "../../../services/CardService";
import { useFormik } from "formik";
import { tribeSchema } from "../../../schemas/index";
export default function MaintainTribes({ cardService = cardServiceImpl }) {
  const [tribes, setTribes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const addToastRef = useRef(null);
  const deleteToastRef = useRef(null);
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
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
    const { data, error } = await cardService.fetchTribes();
    if (error == null) {
      setTribes(data);
      setIsLoading(false);
    } else {
      displayErrorToast(error);
    }
  }
  async function addTribe(values, actions) {
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
  async function deleteTribe(e) {
    deleteToastRef.current = toast("Deleting record...");
    const { error } = await cardService.deleteTribe(Number(e.currentTarget.id));
    updateToast(deleteToastRef, error, true);
    if (error == null) {
      fetchTribes();
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
    React.createElement(MaintainTribesResults, {
      isLoading: isLoading,
      tribes: tribes,
      deleteTribe: deleteTribe,
    })
  );
}
