import React, { useState } from "react";
import MaintainClasses from "./MaintainClasses/MaintainClasses";
import MaintainSets from "./MaintainSets";
import MaintainTribes from "./MaintainTribes/MaintainTribes";
import MetaDataMenu from "./MetaDataMenu";

export default function MetaData() {
  const [selection, setSelection] = useState<string>("");

  const metaDataSelection = (metaData: string) => {
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
