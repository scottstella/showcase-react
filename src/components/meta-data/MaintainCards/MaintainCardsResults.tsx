import React from "react";
import Refreshed from "../../../common/Refreshed";
import { getLastUpdatedString } from "../../../common/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../assets/fontAwesome";
import type { Card } from "../../../dto/Card";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

interface MaintainCardsResultsProps {
  isLoading: boolean;
  cards: Card[];
  deleteCard: (event: React.MouseEvent<SVGSVGElement>) => void;
  onSelectCard: (card: Card) => void;
}

const MaintainCardsResults = (props: MaintainCardsResultsProps) => {
  return (
    <table className="maintain-cards-table">
      <caption>
        <Refreshed loading={props.isLoading} />
      </caption>
      <thead>
        <tr>
          <th>Action</th>
          <th>Name</th>
          <th>Set</th>
          <th>Class</th>
          <th>Type</th>
          <th>Rarity</th>
          <th>Mana</th>
          <th>Collectible</th>
          <th>Token</th>
          <th>Legendary</th>
          <th>Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {props.cards.map(card => (
          <tr
            key={card.id}
            className="clickable-table-row"
            onClick={() => props.onSelectCard(card)}
            data-testid={`card-row-${card.id}`}
          >
            <td style={{ width: "75px" }}>
              <FontAwesomeIcon
                icon={faTrashCan}
                id={card.id}
                onClick={event => {
                  event.stopPropagation();
                  props.deleteCard(event);
                }}
                data-testid="delete-card"
              />
            </td>
            <td>{card.name}</td>
            <td>{card.set?.name ?? ""}</td>
            <td>{card.hero_class?.name ?? ""}</td>
            <td>{card.card_type}</td>
            <td>{card.rarity}</td>
            <td>{card.mana_cost}</td>
            <td>{card.is_collectible ? "Yes" : "No"}</td>
            <td>{card.is_token ? "Yes" : "No"}</td>
            <td>{card.is_legendary ? "Yes" : "No"}</td>
            <td>{getLastUpdatedString(card.updated_at ?? card.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MaintainCardsResults;
