import React, { useState } from "react";
import "./MetaDataMenu.css";
const MetaDataMenu = ({ onSelectMetaData }) => {
  const [menuSelection, setMenuSelection] = useState("");
  const makeMenuSelection = e => {
    const id = e.currentTarget.id;
    setMenuSelection(id);
    onSelectMetaData(id);
  };
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { className: "meta-data-menu" },
      React.createElement(
        "div",
        {
          id: "sets",
          onClick: makeMenuSelection,
          className: `${menuSelection === "sets" ? "meta-data-menu__selected" : ""}`,
        },
        "Sets"
      ),
      React.createElement(
        "div",
        {
          id: "classes",
          onClick: makeMenuSelection,
          className: `${menuSelection === "classes" ? "meta-data-menu__selected" : ""}`,
        },
        "Hero Classes"
      ),
      React.createElement(
        "div",
        {
          id: "tribes",
          onClick: makeMenuSelection,
          className: `${menuSelection === "tribes" ? "meta-data-menu__selected" : ""}`,
        },
        "Tribes"
      )
    ),
    React.createElement("hr", null)
  );
};
export default MetaDataMenu;
