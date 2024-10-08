import React from "react";
import Refreshed from "../../../common/Refreshed";
import { getLastUpdatedString } from "../../../common/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../assets/fontAwesome";

// Define the type for the heroClass object
interface HeroClass {
  id: string;
  name: string;
  created_at: string; // Adjust the type based on the actual format
}

// Define the type for props
interface MaintainClassesResultsProps {
  isLoading: boolean;
  heroClasses: HeroClass[];
  deleteHeroClass: (event: React.MouseEvent<HTMLElement>) => void;
}

const MaintainClassesResults: React.FC<MaintainClassesResultsProps> = (
  props
) => {
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
        {props.heroClasses.map((heroClass) => (
          <tr key={heroClass.id}>
            <td style={{ width: "75px" }}>
              <FontAwesomeIcon
                icon="trash-can"
                id={heroClass.id}
                onClick={props.deleteHeroClass}
              />
            </td>
            <td style={{ width: "75px" }}>{heroClass.id}</td>
            <td>{heroClass.name}</td>
            <td>{getLastUpdatedString(heroClass.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MaintainClassesResults;
