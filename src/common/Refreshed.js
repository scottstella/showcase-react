import React from "react";

export default function Refreshed(props) {
  const getCurrentDateTime = () => {
    const date = new Date();
    return (
      date.getFullYear() +
      "-" +
      ((date.getMonth() + 1) < 10? "0" + (date.getMonth()+1) : (date.getMonth()+1)) +
      "-" +
      (date.getDate() <10? "0" + date.getDate() : date.getDate()) +
      " " +
      (date.getHours() <10? "0" + date.getHours() : date.getHours()) +
      ":" +
      (date.getMinutes() <10? "0" + date.getMinutes() : date.getMinutes()) +
      ":" +
      (date.getSeconds() <10? "0" + date.getSeconds() : date.getSeconds())
    );
  };
  return (
    <div>
      {props.loading ? "Loading..." : "Last updated on " + getCurrentDateTime()}
    </div>
  );
}
