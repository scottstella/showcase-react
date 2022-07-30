import React from "react";
import "./MetaDataMenu.css";

export default function MetaDataMenu(props) {
  const makeMenuSelection = (e) => {
    props.onSelectMetaData(e.target.id);
  };

  return (
    <div>
      <div className="meta-data-menu">
        <div id="sets" onClick={makeMenuSelection}>
          Sets
        </div>
        <div id="classes" onClick={makeMenuSelection}>
          Classes
        </div>
        <div id="tribes" onClick={makeMenuSelection}>
          Tribes
        </div>
      </div>
      <hr />
    </div>
  );
}
