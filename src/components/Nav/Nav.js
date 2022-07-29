import React, { useState } from "react";
import "./Nav.css";
import { NavLink } from "react-router-dom";

export default function Nav() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const clickAdmin = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="nav">
      <div className="nav-item">
        <i
          class={`${
            isCollapsed ? "fa-solid fa-angle-right" : "fa-solid fa-angle-down"
          }`}
        ></i>
        <div onClick={clickAdmin}>Admin</div>
      </div>
      <div class={`${isCollapsed ? "nav-group-collapsed" : ""}`}>
        <li>
          <NavLink to="/ManageMetaData">Manage Meta-Data</NavLink>
        </li>
        <li>Manage Cards</li>
      </div>
      <p>Decks</p>
    </div>
  );
}
