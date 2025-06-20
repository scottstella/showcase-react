import React from "react";
import { getDateAndTimeString } from "./utils";
export default function Refreshed(props) {
  const getCurrentDateTime = () => {
    return getDateAndTimeString(new Date());
  };
  return React.createElement(
    "div",
    null,
    props.loading ? "Loading..." : "Data refreshed on " + getCurrentDateTime()
  );
}
