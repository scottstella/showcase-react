import React, { useState } from "react";
import MaintainClasses from "./MaintainClasses/MaintainClasses";
import MaintainSets from "./MaintainSets/MaintainSets";
import MaintainTribes from "./MaintainTribes/MaintainTribes";
import MetaDataMenu from "./MetaDataMenu";
const MetaData = () => {
  const [selection, setSelection] = useState("");
  const metaDataSelection = selection => {
    setSelection(selection);
  };
  return React.createElement(
    "div",
    null,
    React.createElement(MetaDataMenu, { onSelectMetaData: metaDataSelection }),
    selection === "" && "make a selection",
    selection === "classes" && React.createElement(MaintainClasses, null),
    selection === "sets" && React.createElement(MaintainSets, null),
    selection === "tribes" && React.createElement(MaintainTribes, null)
  );
};
export default MetaData;
