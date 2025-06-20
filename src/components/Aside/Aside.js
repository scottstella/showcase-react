import React from "react";
import "./Aside.css";
export default function Aside() {
  return React.createElement(
    "aside",
    { className: "aside", role: "complementary" },
    React.createElement(
      "ul",
      null,
      React.createElement(
        "li",
        null,
        React.createElement("p", null, React.createElement("strong", null, "Developed:")),
        React.createElement("p", null, "2022-2025")
      ),
      React.createElement(
        "li",
        null,
        React.createElement("p", null, React.createElement("strong", null, "Showcasing")),
        React.createElement(
          "p",
          null,
          "React, Javascript, CSS, Supabase, Toastify, Font Awesome, Formik, Bruno"
        )
      ),
      React.createElement(
        "li",
        null,
        React.createElement("p", null, React.createElement("strong", null, "Developed by:")),
        React.createElement("p", null, "Scott Stella")
      )
    )
  );
}
