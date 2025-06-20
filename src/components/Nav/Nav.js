import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Nav.css";
export default function Nav() {
  const [isAdminCollapsed, setIsAdminCollapsed] = useState(true);
  const [isDecksCollapsed, setIsDecksCollapsed] = useState(true);
  const clickAdmin = () => {
    setIsAdminCollapsed(!isAdminCollapsed);
  };
  const clickDecks = () => {
    setIsDecksCollapsed(!isDecksCollapsed);
  };
  return React.createElement(
    "div",
    { className: "nav" },
    React.createElement("h2", null, "Menu"),
    React.createElement(
      "div",
      { className: "nav-collapsable" },
      React.createElement("i", {
        className: `${isAdminCollapsed ? "fa-solid fa-angle-right" : "fa-solid fa-angle-down"}`,
      }),
      React.createElement("div", { onClick: clickAdmin }, "Admin")
    ),
    React.createElement(
      "div",
      { className: `${isAdminCollapsed ? "nav-group-collapsed" : "nav-group-expanded"}` },
      React.createElement(
        NavLink,
        { to: "/ManageMetaData", className: "nav-link" },
        "Manage Meta-Data"
      ),
      React.createElement(NavLink, { to: "/ManageMetaData", className: "nav-link" }, "Manage Cards")
    ),
    React.createElement(
      "div",
      { className: "nav-collapsable" },
      React.createElement("i", {
        className: `${isDecksCollapsed ? "fa-solid fa-angle-right" : "fa-solid fa-angle-down"}`,
      }),
      React.createElement("div", { onClick: clickDecks }, "Decks")
    ),
    React.createElement(
      "div",
      { className: `${isDecksCollapsed ? "nav-group-collapsed" : "nav-group-expanded"}` },
      React.createElement(NavLink, { to: "/ManageMetaData", className: "nav-link" }, "Link 1"),
      React.createElement(NavLink, { to: "/ManageMetaData", className: "nav-link" }, "Link 2")
    )
  );
}
