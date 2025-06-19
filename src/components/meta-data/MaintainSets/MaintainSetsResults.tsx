import React from "react";
import Refreshed from "../../../common/Refreshed";
import { getLastUpdatedString } from "../../../common/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../assets/fontAwesome";
import type { Set } from "../../../dto/Set";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

// Define the type for props
interface MaintainSetsResultsProps {
  isLoading: boolean;
  sets: Set[];
  deleteSet: (event: React.MouseEvent<SVGSVGElement>) => void;
}

const MaintainSetsResults: React.FC<MaintainSetsResultsProps> = props => {
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
          <th>Standard Set</th>
          <th>Release Date</th>
          <th>Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {props.sets.map(set => (
          <tr key={set.id}>
            <td style={{ width: "75px" }}>
              <FontAwesomeIcon
                icon={faTrashCan}
                id={set.id.toString()}
                onClick={props.deleteSet}
                data-testid="delete-set"
              />
            </td>
            <td style={{ width: "75px" }}>{set.id}</td>
            <td>{set.name}</td>
            <td>{set.is_standard ? "Yes" : "No"}</td>
            <td>{new Date(set.release_date).toLocaleDateString()}</td>
            <td>{getLastUpdatedString(set.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MaintainSetsResults;
