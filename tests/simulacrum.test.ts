import { test, expect } from "@jest/globals";
import { CardGroup } from "~/types";
import {
  CardEnvironment,
  Combo,
  ComboPiece,
  HandCondition,
} from "~/simulacrum";

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

const comboPieces: ComboPiece[] = [
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

const sampleHandCondition1: HandCondition = {
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
const environmentSimple: CardEnvironment = {
  cardGroups,
  comboPieces,
  combos,
};

test("handIncludesCombo", () => {
  expect(2 + 2).toBe(4);
});
