import React from "react";
import { getDateAndTimeString } from "./utils.js";

export default function Refreshed(props) {
  const getCurrentDateTime = () => {
    return getDateAndTimeString(new Date());
  };
  return (
    <div>
      {props.loading
        ? "Loading..."
        : "Data refreshed on " + getCurrentDateTime()}
    </div>
  );
}
