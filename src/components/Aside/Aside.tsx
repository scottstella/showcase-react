import React from "react";
import "./Aside.css";

export default function Aside() {
  return (
    <div className="aside">
      <ul>
        <li>
          <p>
            <strong>Developed:</strong>
          </p>
          <p>July 2022</p>
        </li>
        <li>
          <p>
            <strong>Showcasing</strong>
          </p>
          <p>
            React, Javascript, CSS, Supabase, Toastify, Font Awesome, Formik, Bruno
          </p>
        </li>
        <li>
          <p>
            <strong>Developed by:</strong>
          </p>
          <p>Scott Stella</p>
        </li>
      </ul>
    </div>
  );
}
