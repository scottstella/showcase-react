import React from "react";
import { NavLink } from "react-router-dom";
import hearthstoneBanner from "../../assets/images/hearthstone-banner.png";
import Auth from "../Auth";
import "./Header.css";
import "../Auth.css";

const Header: React.FC = () => {
  return (
    <div className="header">
      <div className="header-left">
        <NavLink to="/">
          <img className="header-logo" src={hearthstoneBanner} alt="hearthstone-banner" />
        </NavLink>
        <h1>Deck Tracker</h1>
      </div>
      <div className="header-right">
        <Auth />
      </div>
    </div>
  );
};

export default Header;
