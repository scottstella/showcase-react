import React from "react";
import Refreshed from "../../../common/Refreshed.jsx";
import { getLastUpdatedString } from "../../../common/utils.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../../assets/fontAwesome';

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
}