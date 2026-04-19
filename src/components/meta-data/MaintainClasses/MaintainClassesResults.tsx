import React from "react";
import Refreshed from "../../../common/Refreshed";
import { getLastUpdatedString } from "../../../common/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../assets/fontAwesome";
import type { HeroClass } from "../../../dto/HeroClass";

// Define the type for props
interface MaintainClassesResultsProps {
  isLoading: boolean;
  heroClasses: HeroClass[];
  deleteHeroClass: (event: React.MouseEvent<SVGSVGElement>) => void;
  onSelectHeroClass: (heroClass: HeroClass) => void;
}

const MaintainClassesResults = (props: MaintainClassesResultsProps) => {
  return (
    <table>
      <caption>
        <Refreshed loading={props.isLoading} />
      </caption>
      <thead>
        <tr>
          <th>Action</th>
          <th>ID</th>
          <th>Name</th>
          <th>Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {props.heroClasses.map(heroClass => (
          <tr
            key={heroClass.id}
            className="clickable-table-row"
            onClick={() => props.onSelectHeroClass(heroClass)}
            data-testid={`class-row-${heroClass.id}`}
          >
            <td style={{ width: "75px" }}>
              <FontAwesomeIcon
                icon="trash-can"
                id={String(heroClass.id)}
                onClick={event => {
                  event.stopPropagation();
                  props.deleteHeroClass(event);
                }}
                data-testid="delete-class"
              />
            </td>
            <td style={{ width: "75px" }}>{heroClass.id}</td>
            <td>{heroClass.name}</td>
            <td>{getLastUpdatedString(heroClass.updated_at ?? heroClass.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MaintainClassesResults;
