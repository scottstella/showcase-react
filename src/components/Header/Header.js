import React from "react";
import { NavLink } from "react-router-dom";
import hearthstoneBanner from "../../assets/images/hearthstone-banner.png";
import Auth from "../Auth";
import "./Header.css";
import "../Auth.css";
const Header = () => {
  return React.createElement(
    "div",
    { className: "header" },
    React.createElement(
      "div",
      { className: "header-left" },
      React.createElement(
        NavLink,
        { to: "/" },
        React.createElement("img", {
          className: "header-logo",
          src: hearthstoneBanner,
          alt: "hearthstone-banner",
        })
      ),
      React.createElement("h1", null, "Deck Tracker")
    ),
    React.createElement("div", { className: "header-right" }, React.createElement(Auth, null))
  );
};
export default Header;
