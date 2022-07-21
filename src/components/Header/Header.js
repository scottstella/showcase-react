import React from "react";
import hearthstoneBanner from "../../assets/images/hearthstone-banner.png";

export default function Header() {
  return (
    <div>
      <img src={hearthstoneBanner} alt="hearthstone-banner" />
      <h1> Deck Tracker</h1>
    </div>
  );
}
