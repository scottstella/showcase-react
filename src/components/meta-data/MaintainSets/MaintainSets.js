import React, { useState, useEffect, useRef } from "react";
import "../../../common/input-group.css";
import "../../../common/table.css";
import { toast } from "react-toastify";
import MaintainSetsResults from "./MaintainSetsResults";
import { displayErrorToast, updateToast } from "../../../common/toastHelpers";
import cardServiceImpl from "../../../services/CardService";
import { useFormik } from "formik";
import { setSchema } from "../../../schemas/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import "./MaintainSets.css";
export default function MaintainSets({ cardService = cardServiceImpl }) {
  const [sets, setSets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dateInputRef = useRef(null);
  const addToastRef = useRef(null);
  const deleteToastRef = useRef(null);
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      name: "",
      is_standard: false,
      release_date: new Date().toISOString().split("T")[0], // Default to today's date
    },
    validationSchema: setSchema,
    onSubmit,
  });
  useEffect(() => {
    fetchSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function onSubmit(values, actions) {
    addSet(values, actions);
  }
  async function fetchSets() {
    setIsLoading(true);
    const { data, error } = await cardService.fetchSets();
    if (error == null) {
      setSets(data);
      setIsLoading(false);
    } else {
      displayErrorToast(error);
    }
  }
  async function addSet(values, actions) {
    addToastRef.current = toast("Adding record...");
    const { error } = await cardService.addSet({
      ...values,
      created_at: new Date().toISOString(),
    });
    updateToast(addToastRef, error, true);
    if (error == null) {
      actions.resetForm();
      fetchSets();
    }
  }
  async function deleteSet(e) {
    deleteToastRef.current = toast("Deleting record...");
    const { error } = await cardService.deleteSet(Number(e.currentTarget.id));
    updateToast(deleteToastRef, error, true);
    if (error == null) {
      fetchSets();
    }
  }
  const handleDateChange = e => {
    handleChange(e);
    // Blur the input to close the picker after selection
    e.target.blur();
  };
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
          { className: "form-row" },
          React.createElement(
            "div",
            null,
            React.createElement(
              "div",
              { className: "form-control" },
              React.createElement("label", { htmlFor: "name" }, "Name"),
              React.createElement(
                "div",
                { className: "input-container" },
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
              )
            ),
            React.createElement(
              "div",
              { className: "checkbox-control" },
              React.createElement(
                "label",
                null,
                React.createElement("input", {
                  type: "checkbox",
                  id: "is_standard",
                  name: "is_standard",
                  checked: values.is_standard,
                  onChange: handleChange,
                  onBlur: handleBlur,
                }),
                "Standard Set"
              )
            )
          ),
          React.createElement(
            "div",
            { className: "form-control date-control" },
            React.createElement("label", { htmlFor: "release_date" }, "Release Date"),
            React.createElement(
              "div",
              { className: "input-container" },
              React.createElement("input", {
                ref: dateInputRef,
                type: "date",
                id: "release_date",
                name: "release_date",
                value: values.release_date,
                onChange: handleDateChange,
                onBlur: handleBlur,
                className: errors.release_date && touched.release_date ? "error" : "",
              }),
              React.createElement(
                "div",
                { className: "icon-container" },
                React.createElement(FontAwesomeIcon, {
                  icon: faCalendar,
                  className: "date-picker-icon",
                })
              ),
              errors.release_date &&
                touched.release_date &&
                React.createElement("div", { className: "error-msg" }, errors.release_date)
            )
          ),
          React.createElement("input", {
            type: "submit",
            value: "Submit",
            className: "submit-button",
          })
        )
      )
    ),
    React.createElement(MaintainSetsResults, {
      isLoading: isLoading,
      sets: sets,
      deleteSet: deleteSet,
    })
  );
}
