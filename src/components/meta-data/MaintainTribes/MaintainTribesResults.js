import React from "react";
import Refreshed from "../../../common/Refreshed";
import { getLastUpdatedString } from "../../../common/utils.js";

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
              <i
                class="fa-solid fa-trash-can"
                id={tribe.id}
                onClick={props.deleteTribe}
              ></i>
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
