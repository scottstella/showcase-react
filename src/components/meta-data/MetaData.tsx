import React, { useState } from "react";
import MaintainClasses from "./MaintainClasses/MaintainClasses";
import MaintainSets from "./MaintainSets/MaintainSets";
import MaintainTribes from "./MaintainTribes/MaintainTribes";
import MetaDataMenu from "./MetaDataMenu";

const MetaData = () => {
  const [selection, setSelection] = useState<string>("");

  const metaDataSelection = (selection: string) => {
    setSelection(selection);
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
};

export default MetaData;
