import { CardId, CardInfo } from "~/types";
import { CardGroup } from "~/types";

const spreadOutDeck = [
  1, 1, 2, 10, 10, 11, 400, 1000, 1000, 1001, 1002, 1003, 1004, 1005, 1006,
];

const cardGroups: CardGroup[] = [
  {
    id: 1,
    name: "Combo Piece 1",
    cardIds: [1, 2],
  },
  {
    id: 2,
    name: "Combo Piece 2",
    cardIds: [10, 11],
  },
  {
    id: 3,
    name: "Bricks",
    cardIds: [400],
  },
];

const allComboPieces: ComboPiece[] = [
  {
    id: 1,
    foreignId: 1,
    type: "group",
  },
  {
    id: 2,
    foreignId: 2,
    type: "group",
  },
];

const combos: Combo[] = [
  {
    id: 1,
    comboPieceIds: [1, 2],
    numberRequired: 2,
  },
];

interface ComboPiece {
  id: number;
  foreignId: number;
  type: "card" | "group";
}

type ComboId = number;
type GroupId = number;

interface Combo {
  id: ComboId;
  comboPieceIds: number[];
  numberRequired: number;
}
interface Condition {
  foreignId: number;
  type: "card" | "group" | "combo";
}

interface HandCondition {
  shouldIncludeAtLeastOneOf: Condition[];
  mustNotInclude: Condition[];
}

const sampleHandCondition: HandCondition = {
  shouldIncludeAtLeastOneOf: [
    {
      foreignId: 1,
      type: "combo",
    },
  ],
  mustNotInclude: [
    {
      foreignId: 3,
      type: "group",
    },
  ],
};

const simulateHand = (spreadOutDeck: CardId[], handSize: number) => {
  const indices = naiveGetRandomIntegersWithoutReplacement(
    handSize,
    spreadOutDeck.length,
  );
  return spreadOutDeck.filter((_, index) => indices.includes(index));
};

const evaluateHand = (hand: CardId[], handCondition: HandCondition) => {
  if (handCondition.shouldIncludeAtLeastOneOf.length === 0) {
    return false;
  }
  if (
    handCondition.mustNotInclude.some((condition) =>
      evaluateCondition(hand, condition),
    )
  ) {
    return false;
  }
  return handCondition.shouldIncludeAtLeastOneOf.some((condition) =>
    evaluateCondition(hand, condition),
  );
};

const handIncludesGroup = (hand: CardId[], groupId: GroupId) => {
  const group = cardGroups.find((group) => group.id === groupId);
  if (!group) {
    return false;
  }
  return group.cardIds.some((cardId) => hand.includes(cardId));
};

const handIncludesCombo = (hand: CardId[], combo: Combo) => {
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
        return hand.includes(comboPiece.foreignId);
      case "group":
        return handIncludesGroup(hand, comboPiece.foreignId);
      default:
        throw new Error("Invalid combo piece type");
    }
  });
  return successes.filter((success) => success).length >= combo.numberRequired;
};

const evaluateCondition = (hand: CardId[], condition: Condition) => {
  switch (condition.type) {
    case "card":
      return hand.includes(condition.foreignId);
    case "group":
      return handIncludesGroup(hand, condition.foreignId);
    case "combo":
      return handIncludesGroup(hand, condition.foreignId);
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

const timeStart = Date.now();
for (let i = 0; i < 10; i++) {
  const hand = naiveGetRandomIntegersWithoutReplacement(5, 40);
  const wasSuccessful = evaluateHand(hand, sampleHandCondition);
  const groupWasSuccessful = handIncludesGroup(hand, 2);
  console.log(`hand: ${hand.toString()}, group 2: ${groupWasSuccessful}`);
  console.log(`hand: ${hand.toString()}, wasSuccessful: ${wasSuccessful}`);
}
const timeEnd = Date.now();
console.log("time elapsed (ms): ", timeEnd - timeStart);
