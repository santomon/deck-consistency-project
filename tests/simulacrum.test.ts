import { test, expect } from "@jest/globals";
import {CardEnvironment, CardGroup, Combo, ComboPiece, HandCondition} from "~/types";
import {
  evaluateHand,
  handIncludesCombo,
} from "~/simulacrum";

const spreadOutDeck = [
  "1",
  "1",
  "2",
  "10",
  "10",
  "11",
  "400",
  "1000",
  "1000",
  "1001",
  "1002",
  "1003",
  "1004",
  "1005",
  "1006",
];

const cardGroups: CardGroup[] = [
  {
    id: 1,
    name: "Combo Piece 1",
    cards: ["1", "2"],
  },
  {
    id: 2,
    name: "Combo Piece 2",
    cards: ["10", "11"],
  },
  {
    id: 3,
    name: "Bricks",
    cards: ["400"],
  },
];

const comboPiecesX: ComboPiece[] = [
  {
    foreignId: 1,
    type: "group",
  },
  {
    foreignId: 2,
    type: "group",
  },
  {
    foreignId: "1",
    type: "card",
  },
];

const combos: Combo[] = [
  {
    id: 1,
    comboPieces: [comboPiecesX[0]!, comboPiecesX[1]!],
    numberRequired: 2,
    name: "basic 2 card combo",
  },
  {
    id: 2,
    comboPieces: [comboPiecesX[0]!, comboPiecesX[2]!],
    numberRequired: 2,
    name: "2 card combo, where 1 card occurs on both sides",
  },
];

const sampleHandCondition1: HandCondition = {
  id: 1,
  name: "condition 1",
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
  combos,
};

test("handIncludesCombo1", () => {
  const hand = ["1", "10"];
  expect(handIncludesCombo(hand, 1, environmentSimple)).toBe(true);
});

test("handIncludesCombo2", () => {
  const hand = ["1", "10", "400"];
  expect(handIncludesCombo(hand, 1, environmentSimple)).toBe(true);
});

test("handIncludesCombo3", () => {
  const hand = ["2", "11", "1001"];
  expect(handIncludesCombo(hand, 1, environmentSimple)).toBe(true);
});

test("handDoesNotIncludeCombo4", () => {
  const hand = ["11", "2"];
  expect(handIncludesCombo(hand, 1, environmentSimple)).toBe(true);
});

test("comboInclusionWithRightNumberOfCards1", () => {
  // for instance, rb ritual beast combo, 2x new lara could be full combo,
  // but we would still need at least 2 new laras and not just 1
  const hand = ["1"];
  expect(handIncludesCombo(hand, 2, environmentSimple)).toBe(false);
});

test("comboInclusionWithRightNumberOfCards2", () => {
  const hand = ["1", "2"];
  expect(handIncludesCombo(hand, 2, environmentSimple)).toBe(true);
});

test("handDoesNotIncludeCombo1", () => {
  const hand = ["1", "1"];
  expect(handIncludesCombo(hand, 1, environmentSimple)).toBe(false);
});

test("evaluateHands1", () => {
  const hand = ["1", "1", "2"];
  expect(evaluateHand(hand, sampleHandCondition1, environmentSimple)).toBe(
    false,
  );
});

test("evaluateHands2", () => {
  const hand = ["1", "10", "2"];
  expect(evaluateHand(hand, sampleHandCondition1, environmentSimple)).toBe(
    true,
  );
});

test("evaluateHands3", () => {
  const hand = ["1", "10", "400"];
  expect(evaluateHand(hand, sampleHandCondition1, environmentSimple)).toBe(
    false,
  );
});
