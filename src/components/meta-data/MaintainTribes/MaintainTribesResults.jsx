import React from "react";
import Refreshed from "../../../common/Refreshed.tsx";
import { getLastUpdatedString } from "../../../common/utils.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function MaintainTribesResults(props) {
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
}
