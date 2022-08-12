import React from "react";
import Refreshed from "../../../common/Refreshed";
import { getLastUpdatedString } from "../../../common/utils.js";

export default function MaintainClassesResults(props) {
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
              <i
                class="fa-solid fa-trash-can"
                id={heroClass.id}
                onClick={props.deleteHeroClass}
              ></i>
            </td>
            <td style={{ width: "75px" }}>{heroClass.id}</td>
            <td>{heroClass.name}</td>
            <td>{getLastUpdatedString(heroClass.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
