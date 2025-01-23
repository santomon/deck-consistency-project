import { createStore, create } from "zustand";
import { CardGroup, CardInfoSchema } from "~/types";
import { CardLimit } from "~/constants";

interface I_DeckState {
  mainDeck: Map<number, number>;
  groups: CardGroup[];
  addCardToGroup: (groupId: number, cardId: number) => void;
  removeCardFromGroup: (groupId: number, cardId: number) => void;
  createGroup: () => number;
  addCardToMainDeck: (cardId: number, limit: CardLimit) => void;
  removeCardFromMainDeck: (cardId: number) => void;
  replaceMainDeck: (cardIds: number[]) => void;
}

const countElements = (elements: number[]): Map<number, number> => {
  const countMap = new Map<number, number>();
  for (const element of elements) {
    countMap.set(element, (countMap.get(element) ?? 0) + 1);
  }
  return countMap;
};

export const useDeckStore = create<I_DeckState>((set) => {
  return {
    mainDeck: new Map<number, number>(),
    groups: [],
    createGroup: () => {
      let newId = -1;
      set((state) => {
        newId = Math.max(...state.groups.map((group) => group.id), 0) + 1;
        const newGroup = {
          id: newId,
          name: `Group ${newId}`,
          cardIds: [],
        };
        return {
          ...state,
          groups: [...state.groups, newGroup],
        };
      });

      return newId;
    },
    addCardToGroup: (groupId: number, cardId: number) =>
      set((state) => {
        const updatedGroups = state.groups.map((group) => {
          if (group.id !== groupId) {
            return group;
          }
          if (group.cardIds.includes(cardId)) {
            return group;
          }
          return {
            ...group,
            cardIds: [...group.cardIds, cardId],
          };
        });
        return {
          ...state,
          groups: updatedGroups,
        };
      }),
    removeCardFromGroup: (groupId: number, cardId: number) =>
      set((state) => {
        const updatedGroups = state.groups.map((group) => {
          if (group.id !== groupId) {
            return group;
          }
          if (!group.cardIds.includes(cardId)) {
            return group;
          }
          const cardIndex = group.cardIds.indexOf(cardId);
          const updatedCardIds = group.cardIds.filter(
            (_, index) => index !== cardIndex,
          );
          return {
            ...group,
            cardIds: updatedCardIds,
          };
        });
        return {
          ...state,
          groups: updatedGroups,
        };
      }),
    addCardToMainDeck: (cardId: number, limit = CardLimit.UNLIMITED) =>
      set((state) => {
        const updatedDeck = new Map(state.mainDeck);
        updatedDeck.set(cardId, Math.min(updatedDeck.get(cardId) ?? 1, limit));

        return {
          ...state,
          mainDeck: updatedDeck,
        };
      }),
    removeCardFromMainDeck: (cardId: number) =>
      set((state) => {
        const updatedDeck = new Map(state.mainDeck);
        const currentValue = updatedDeck.get(cardId);
        if (!currentValue) {
          return state;
        } else if (currentValue <= 1) {
          updatedDeck.delete(cardId);
        } else {
          updatedDeck.set(cardId, currentValue - 1);
        }
        return {
          ...state,
          mainDeck: updatedDeck,
        };
      }),
    replaceMainDeck: (cardIds: number[]) =>
      set((state) => {
        const newDeck = countElements(cardIds);
        console.log("in replace", newDeck);
        return {
          ...state,
          mainDeck: newDeck,
        };
      }),
  };
});
