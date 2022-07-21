import React from "react";
import hearthstoneBanner from "../../assets/images/hearthstone-banner.png";
import "./Header.css";

export default function Header() {
  return (
    <div className="header">
      <img
        className="header-logo"
        src={hearthstoneBanner}
        alt="hearthstone-banner"
      />
      <h1> Deck Tracker</h1>
    </div>
  );
}
