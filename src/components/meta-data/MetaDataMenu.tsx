import React, { useState } from "react";
import "./MetaDataMenu.css";

interface MetaDataMenuProps {
  onSelectMetaData: (id: string) => void;
}

const MetaDataMenu: React.FC<MetaDataMenuProps> = ({
  onSelectMetaData,
}: MetaDataMenuProps) => {
  const [menuSelection, setMenuSelection] = useState<string>("");

  const makeMenuSelection = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.id;
    setMenuSelection(id);
    onSelectMetaData(id);
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
};

export default MetaDataMenu;
