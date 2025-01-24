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

interface HandHCondition {
  shouldIncludeAtLeastOneOf: Condition[];
  mustNotInclude: Condition[];
}

const simulateHand = (spreadOutDeck: CardId[], handSize: number) => {
  const indices = naiveGetRandomIntegersWithoutReplacement(
    handSize,
    spreadOutDeck.length,
  );
  return spreadOutDeck.filter((_, index) => indices.includes(index));
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
  const test = naiveGetRandomIntegersWithoutReplacement(5, 40);
  console.log(test);
}
const timeEnd = Date.now();
console.log("time elapsed (ms): ", timeEnd - timeStart);
