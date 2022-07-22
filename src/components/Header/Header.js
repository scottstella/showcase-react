import React from "react";
import hearthstoneBanner from "../../assets/images/hearthstone-banner.png";
import "./Header.css";

export default function Header() {
  return (
    <div className="header">
      <a href="/">
        <img
          className="header-logo"
          src={hearthstoneBanner}
          alt="hearthstone-banner"
        />
      </a>
      <h1> Deck Tracker</h1>
    </div>
  );
}
