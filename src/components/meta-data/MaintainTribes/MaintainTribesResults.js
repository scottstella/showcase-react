import React from "react";
import Refreshed from "../../../common/Refreshed";
import { getLastUpdatedString } from "../../../common/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../assets/fontAwesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
const MaintainTribesResults = props => {
  return React.createElement(
    "table",
    null,
    React.createElement(
      "caption",
      null,
      React.createElement(Refreshed, { loading: props.isLoading })
    ),
    React.createElement(
      "thead",
      null,
      React.createElement(
        "tr",
        null,
        React.createElement("th", null, "Action"),
        React.createElement("th", null, "ID"),
        React.createElement("th", null, "Name"),
        React.createElement("th", null, "Last Updated")
      )
    ),
    React.createElement(
      "tbody",
      null,
      props.tribes.map(tribe =>
        React.createElement(
          "tr",
          { key: tribe.id },
          React.createElement(
            "td",
            { style: { width: "75px" } },
            React.createElement(FontAwesomeIcon, {
              icon: faTrashCan,
              id: tribe.id.toString(),
              onClick: props.deleteTribe,
              "data-testid": "delete-tribe",
            })
          ),
          React.createElement("td", { style: { width: "75px" } }, tribe.id),
          React.createElement("td", null, tribe.name),
          React.createElement("td", null, getLastUpdatedString(tribe.created_at))
        )
      )
    )
  );
};
export default MaintainTribesResults;
