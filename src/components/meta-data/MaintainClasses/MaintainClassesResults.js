import React from "react";
import Refreshed from "../../../common/Refreshed";
import { getLastUpdatedString } from "../../../common/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../assets/fontAwesome";
const MaintainClassesResults = props => {
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
      props.heroClasses.map(heroClass =>
        React.createElement(
          "tr",
          { key: heroClass.id },
          React.createElement(
            "td",
            { style: { width: "75px" } },
            React.createElement(FontAwesomeIcon, {
              icon: "trash-can",
              id: String(heroClass.id),
              onClick: props.deleteHeroClass,
            })
          ),
          React.createElement("td", { style: { width: "75px" } }, heroClass.id),
          React.createElement("td", null, heroClass.name),
          React.createElement("td", null, getLastUpdatedString(heroClass.created_at))
        )
      )
    )
  );
};
export default MaintainClassesResults;
