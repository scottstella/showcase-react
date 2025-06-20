import React from "react";
import Refreshed from "../../../common/Refreshed";
import { getLastUpdatedString } from "../../../common/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../assets/fontAwesome";
import type { Tribe } from "../../../dto/Tribe";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

// Define the type for props
interface MaintainTribesResultsProps {
  isLoading: boolean;
  tribes: Tribe[];
  deleteTribe: (event: React.MouseEvent<SVGSVGElement>) => void;
}

const MaintainTribesResults = (props: MaintainTribesResultsProps) => {
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
        {props.tribes.map(tribe => (
          <tr key={tribe.id}>
            <td style={{ width: "75px" }}>
              <FontAwesomeIcon
                icon={faTrashCan}
                id={tribe.id.toString()}
                onClick={props.deleteTribe}
                data-testid="delete-tribe"
              />
            </td>
            <td style={{ width: "75px" }}>{tribe.id}</td>
            <td>{tribe.name}</td>
            <td>{getLastUpdatedString(tribe.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MaintainTribesResults;
