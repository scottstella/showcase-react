import React from "react";

export default function Refreshed(props) {
  const getCurrentDateTime = () => {
    const date = new Date();
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds()
    );
  };
  return (
    <div>
      {props.loading ? "Loading..." : "Last updated on " + getCurrentDateTime()}
    </div>
  );
}
