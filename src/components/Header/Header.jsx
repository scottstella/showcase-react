import React from "react";
import { NavLink } from "react-router-dom";
import hearthstoneBanner from "../../assets/images/hearthstone-banner.png";
import "./Header.css";

export default function Header() {
  return (
    <div className="header">
      <NavLink to="/">
        <img
          className="header-logo"
          src={hearthstoneBanner}
          alt="hearthstone-banner"
        />
      </NavLink>
      <h1> Deck Tracker</h1>
    </div>
  );
}
