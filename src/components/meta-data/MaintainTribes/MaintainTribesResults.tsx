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
  deleteTribe: (id: number) => void;
  onSelectTribe: (tribe: Tribe) => void;
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
          <tr
            key={tribe.id}
            className="clickable-table-row"
            onClick={() => props.onSelectTribe(tribe)}
            data-testid={`tribe-row-${tribe.id}`}
          >
            <td style={{ width: "75px" }}>
              <FontAwesomeIcon
                icon={faTrashCan}
                onClick={event => {
                  event.stopPropagation();
                  props.deleteTribe(tribe.id);
                }}
                data-testid="delete-tribe"
              />
            </td>
            <td style={{ width: "75px" }}>{tribe.id}</td>
            <td>{tribe.name}</td>
            <td>{getLastUpdatedString(tribe.updated_at ?? tribe.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MaintainTribesResults;
