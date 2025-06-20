import React from "react";
import Refreshed from "../../../common/Refreshed";
import { getLastUpdatedString } from "../../../common/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../assets/fontAwesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
const MaintainSetsResults = props => {
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
        React.createElement("th", null, "Standard Set"),
        React.createElement("th", null, "Release Date"),
        React.createElement("th", null, "Last Updated")
      )
    ),
    React.createElement(
      "tbody",
      null,
      props.sets.map(set =>
        React.createElement(
          "tr",
          { key: set.id },
          React.createElement(
            "td",
            { style: { width: "75px" } },
            React.createElement(FontAwesomeIcon, {
              icon: faTrashCan,
              id: set.id.toString(),
              onClick: props.deleteSet,
              "data-testid": "delete-set",
            })
          ),
          React.createElement("td", { style: { width: "75px" } }, set.id),
          React.createElement("td", null, set.name),
          React.createElement("td", null, set.is_standard ? "Yes" : "No"),
          React.createElement("td", null, new Date(set.release_date).toLocaleDateString()),
          React.createElement("td", null, getLastUpdatedString(set.created_at))
        )
      )
    )
  );
};
export default MaintainSetsResults;
