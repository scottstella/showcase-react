import React from "react";
import Refreshed from "../../../common/Refreshed";
import { getLastUpdatedString } from "../../../common/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tribe } from "../../../dto/Tribe";

// Define the type for props
interface MaintainTribesResultsProps {
  isLoading: boolean;
  tribes: Tribe[];
  deleteTribe: (event: React.MouseEvent<HTMLElement>) => void;
}

const MaintainTribesResults: React.FC<MaintainTribesResultsProps> = (props) => {
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
        {props.tribes.map((tribe) => (
          <tr key={tribe.id}>
            <td style={{ width: "75px" }}>
              <FontAwesomeIcon
                icon="trash-can"
                id={tribe.id}
                onClick={props.deleteTribe}
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
