import { test, expect } from "@jest/globals";
import { CardGroup } from "~/types";
import {
  CardEnvironment,
  Combo,
  ComboPiece,
  evaluateHand,
  HandCondition,
  handIncludesCombo,
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

test("handIncludesCombo1", () => {
  const hand = [1, 10];
  expect(handIncludesCombo(hand, 1, environmentSimple)).toBe(true);
});

test("handIncludesCombo2", () => {
  const hand = [1, 10, 400];
  expect(handIncludesCombo(hand, 1, environmentSimple)).toBe(true);
});

test("handIncludesCombo3", () => {
  const hand = [2, 11, 1001];
  expect(handIncludesCombo(hand, 1, environmentSimple)).toBe(true);
});

test("handDoesNotIncludeCombo4", () => {
  const hand = [11, 2];
  expect(handIncludesCombo(hand, 1, environmentSimple)).toBe(true);
});

test("handDoesNotIncludeCombo1", () => {
  const hand = [1, 1];
  expect(handIncludesCombo(hand, 1, environmentSimple)).toBe(false);
});

test("evaluateHands1", () => {
  const hand = [1, 1, 2];
  expect(evaluateHand(hand, sampleHandCondition1, environmentSimple)).toBe(
    false,
  );
});

test("evaluateHands2", () => {
  const hand = [1, 10, 2];
  expect(evaluateHand(hand, sampleHandCondition1, environmentSimple)).toBe(
    true,
  );
});

test("evaluateHands3", () => {
  const hand = [1, 10, 400];
  expect(evaluateHand(hand, sampleHandCondition1, environmentSimple)).toBe(
    false,
  );
});
