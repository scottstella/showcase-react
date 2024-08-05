import React, { useState } from "react";
import "./MetaDataMenu.css";

export default function MetaDataMenu(props) {
  const [menuSelection, setMenuSelection] = useState("");

  const makeMenuSelection = (e) => {
    setMenuSelection(e.target.id);
    props.onSelectMetaData(e.target.id);
  };

  return (
    <div>
      <div className="meta-data-menu">
        <div
          id="sets"
          onClick={makeMenuSelection}
          className={`${
            menuSelection === "sets" ? "meta-data-menu__selected" : ""
          }`}
        >
          Sets
        </div>
        <div
          id="classes"
          onClick={makeMenuSelection}
          className={`${
            menuSelection === "classes" ? "meta-data-menu__selected" : ""
          }`}
        >
          Hero Classes
        </div>
        <div
          id="tribes"
          onClick={makeMenuSelection}
          className={`${
            menuSelection === "tribes" ? "meta-data-menu__selected" : ""
          }`}
        >
          Tribes
        </div>
      </div>
      <hr />
    </div>
  );
}
