import React, { useState } from "react";
import "./Nav.css";

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
          <a href="/ManageMetaData">Manage Meta-Data</a>
        </li>
        <li>Manage Cards</li>
      </div>
      <p>Decks</p>
    </div>
  );
}
