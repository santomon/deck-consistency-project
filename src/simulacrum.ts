import { CardId, CardInfo } from "~/types";
import { CardGroup } from "~/types";

export interface ComboPiece {
  id: number;
  foreignId: number | string;
  type: "card" | "group";
}

export type ComboId = number;
export type GroupId = number;

export interface Combo {
  id: ComboId;
  comboPieceIds: number[];
  numberRequired: number;
}
export interface Condition {
  foreignId: number | string;
  type: "card" | "group" | "combo";
}

export interface HandCondition {
  shouldIncludeAtLeastOneOf: Condition[];
  mustNotInclude: Condition[];
}

export interface CardEnvironment {
  cardGroups: CardGroup[];
  comboPieces: ComboPiece[];
  combos: Combo[];
}

const simulateHand = (spreadOutDeck: string[], handSize: number) => {
  const indices = naiveGetRandomIntegersWithoutReplacement(
    handSize,
    spreadOutDeck.length,
  );
  return spreadOutDeck.filter((_, index) => indices.includes(index));
};

const evaluateHand = (
  hand: string[],
  handCondition: HandCondition,
  environment: CardEnvironment,
) => {
  if (handCondition.shouldIncludeAtLeastOneOf.length === 0) {
    return false;
  }
  if (
    handCondition.mustNotInclude.some((condition) =>
      evaluateCondition(hand, condition, environment),
    )
  ) {
    return false;
  }
  return handCondition.shouldIncludeAtLeastOneOf.some((condition) =>
    evaluateCondition(hand, condition, environment),
  );
};

const handIncludesGroup = (
  hand: string[],
  groupId: GroupId,
  environment: CardEnvironment,
) => {
  const group = environment.cardGroups.find((group) => group.id === groupId);
  if (!group) {
    return false;
  }
  return group.cards.some((cardId) => hand.includes(cardId));
};

const handIncludesCombo = (
  hand: string[],
  comboId: ComboId,
  environment: CardEnvironment,
) => {
  const {
    cardGroups: allCardGroups,
    comboPieces: allComboPieces,
    combos: allCombos,
  } = environment;
  const combo = allCombos.find((combo) => combo.id === comboId);
  if (!combo) {
    throw new Error("Invalid combo id");
  }
  const comboPieces = combo.comboPieceIds.map((comboPieceId) => {
    const comboPiece = allComboPieces.find(
      (comboPiece) => comboPiece.id === comboPieceId,
    );
    if (!comboPiece) {
      throw new Error("Invalid combo piece id");
    }
    return comboPiece;
  });
  const successes = comboPieces.map((comboPiece) => {
    switch (comboPiece.type) {
      case "card":
        if (typeof comboPiece.foreignId === "string") {
          return hand.includes(comboPiece.foreignId);
        }
        throw new Error(
          "foreign id of combo piece of type card is not a string",
        );
      case "group":
        if (typeof comboPiece.foreignId === "number") {
          return handIncludesGroup(hand, comboPiece.foreignId, environment);
        }
        throw new Error(
          "foreign id of combo piece of type group is not a number",
        );
      default:
        throw new Error("Invalid combo piece type");
    }
  });
  return successes.filter((success) => success).length >= combo.numberRequired;
};

const evaluateCondition = (
  hand: string[],
  condition: Condition,
  environment: CardEnvironment,
) => {
  switch (condition.type) {
    case "card":
      if (typeof condition.foreignId === "string") {
        return hand.includes(condition.foreignId);
      }
      throw new Error("foreign id of condition of type card is not a string");
    case "group":
      if (typeof condition.foreignId === "number") {
        return handIncludesGroup(hand, condition.foreignId, environment);
      }
      throw new Error("foreign id of condition of type group is not a number");
    case "combo":
      if (typeof condition.foreignId === "number") {
        return handIncludesCombo(hand, condition.foreignId, environment);
      }
      throw new Error("foreign id of condition of type combo is not a number");
    default:
      throw new Error("Invalid condition type");
  }
};

const naiveGetRandomInteger = (max: number) => {
  return Math.floor(Math.random() * max);
};

const naiveGetRandomIntegersWithoutReplacement = (k: number, max: number) => {
  if (k > max) {
    throw new Error("k must be less than or equal to max");
  }
  const result: number[] = [];
  while (result.length < k) {
    const randomInt = naiveGetRandomInteger(max);
    if (!result.includes(randomInt)) {
      result.push(randomInt);
    }
  }
  return result;
};

export {
  handIncludesGroup,
  handIncludesCombo,
  evaluateCondition,
  evaluateHand,
};
