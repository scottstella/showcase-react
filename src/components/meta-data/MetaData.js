import React, { useState } from "react";
import MaintainClasses from "./MaintainClasses";
import MaintainSets from "./MaintainSets";
import MaintainTribes from "./MaintainTribes";
import MetaDataMenu from "./MetaDataMenu";

export default function MetaData() {
  const [selection, setSelection] = useState("");

  const metaDataSelection = (metaData) => {
    setSelection(metaData);
  };

  return (
    <div>
      <MetaDataMenu onSelectMetaData={metaDataSelection} />
      {selection === "" && "make a selection"}
      {selection === "classes" && <MaintainClasses />}
      {selection === "sets" && <MaintainSets />}
      {selection === "tribes" && <MaintainTribes />}
    </div>
  );
}
