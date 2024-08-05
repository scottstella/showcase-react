import React, { useState } from "react";
import "./Nav.css";
import { NavLink } from "react-router-dom";

export default function Nav() {
  const [isAdminCollapsed, setIsAdminCollapsed] = useState(true);
  const [isDecksCollapsed, setIsDecksCollapsed] = useState(true);

  const clickAdmin = () => {
    setIsAdminCollapsed(!isAdminCollapsed);
  };
  const clickDecks = () => {
    setIsDecksCollapsed(!isDecksCollapsed);
  };

  return (
    <div className="nav">
      <h2>Menu</h2>
      <div className="nav-collapsable">
        <i
          className={`${
            isAdminCollapsed
              ? "fa-solid fa-angle-right"
              : "fa-solid fa-angle-down"
          }`}
        />
        <div onClick={clickAdmin}>Admin</div>
      </div>
      <div
        className={`${
          isAdminCollapsed ? "nav-group-collapsed" : "nav-group-expanded"
        }`}
      >
        <NavLink to="/ManageMetaData" className="nav-link">
          Manage Meta-Data
        </NavLink>

        <NavLink to="/ManageMetaData" className="nav-link">
          Manage Cards
        </NavLink>
      </div>
      <div className="nav-collapsable">
        <i
          className={`${
            isDecksCollapsed
              ? "fa-solid fa-angle-right"
              : "fa-solid fa-angle-down"
          }`}
        />
        <div onClick={clickDecks}>Decks</div>
      </div>
      <div
        className={`${
          isDecksCollapsed ? "nav-group-collapsed" : "nav-group-expanded"
        }`}
      >
        <NavLink to="/ManageMetaData" className="nav-link">
          Link 1
        </NavLink>

        <NavLink to="/ManageMetaData" className="nav-link">
          Link 2
        </NavLink>
      </div>
    </div>
  );
}
