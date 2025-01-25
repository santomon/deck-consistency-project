import { createStore, create } from "zustand";
import { CardGroup, CardId, CardInfo, CardInfoSchema } from "~/types";
import { CardLimit } from "~/constants";
import { QueryClient } from "react-query";
import { GroupId } from "./simulacrum";
import { queryKeyFactory } from "~/utils";

interface I_DeckState {
  mainDeck: CardId[];
  groups: CardGroup[];
  cardInfoRegister: Map<CardId, CardInfo>;
  addCardInfo: (cardId: CardId, cardInfo: CardInfo) => void;
  createGroup: () => GroupId;
  removeGroup: (groupId: number) => void;
  changeGroupName: (groupId: number, newName: string) => void;
  replaceCardsInGroup: (groupId: number, cards: string[]) => void;
  addCardToGroup: (groupId: number, card: string) => void;
  removeCardFromGroup: (groupId: number, card: string) => void;
  addCardToMainDeck: (
    cardId: number,
    queryClient: QueryClient,
    limit: CardLimit,
  ) => void;
  removeCardFromMainDeck: (cardId: number) => void;
  replaceMainDeck: (cardIds: number[]) => void;
}

const countElements = <T>(elements: T[]) => {
  const countMap = new Map<T, number>();
  for (const element of elements) {
    countMap.set(element, (countMap.get(element) ?? 0) + 1);
  }
  return countMap;
};

export const useDeckStore = create<I_DeckState>((set) => {
  return {
    mainDeck: [],
    groups: [],
    cardInfoRegister: new Map<CardId, CardInfo>(),
    addCardInfo: (cardId: CardId, cardInfo: CardInfo) =>
      set((state) => {
        const updatedRegister = new Map(state.cardInfoRegister);
        updatedRegister.set(cardId, cardInfo);
        return {
          ...state,
          cardInfoRegister: updatedRegister,
        };
      }),
    createGroup: () => {
      let newId = -1;
      set((state) => {
        newId = Math.max(...state.groups.map((group) => group.id), 0) + 1;
        const newGroup = {
          id: newId,
          name: `Group ${newId}`,
          cards: [],
        };
        return {
          ...state,
          groups: [...state.groups, newGroup],
        };
      });

      return newId;
    },
    removeGroup: (groupId: number) =>
      set((state) => {
        return {
          ...state,
          groups: state.groups.filter((group) => group.id !== groupId),
        };
      }),
    changeGroupName: (groupId: number, newName: string) =>
      set((state) => {
        return {
          ...state,
          groups: state.groups.map((group) => {
            if (group.id !== groupId) {
              return group;
            }
            return {
              ...group,
              name: newName,
            };
          }),
        };
      }),
    addCardToGroup: (groupId: number, card: string) =>
      set((state) => {
        const updatedGroups = state.groups.map((group) => {
          if (group.id !== groupId) {
            return group;
          }
          if (group.cards.includes(card)) {
            return group;
          }
          return {
            ...group,
            cards: [...group.cards, card],
          };
        });
        return {
          ...state,
          groups: updatedGroups,
        };
      }),
    removeCardFromGroup: (groupId: number, card: string) =>
      set((state) => {
        const updatedGroups = state.groups.map((group) => {
          if (group.id !== groupId) {
            return group;
          }
          if (!group.cards.includes(card)) {
            return group;
          }
          const cardIndex = group.cards.indexOf(card);
          const updatedCards = group.cards.filter(
            (_, index) => index !== cardIndex,
          );
          return {
            ...group,
            cards: updatedCards,
          };
        });
        return {
          ...state,
          groups: updatedGroups,
        };
      }),
    replaceCardsInGroup: (groupId: number, cards: string[]) =>
      set((state) => {
        const updatedGroups = state.groups.map((group) => {
          if (group.id !== groupId) {
            return group;
          }
          return {
            ...group,
            cards,
          };
        });
        return {
          ...state,
          groups: updatedGroups,
        };
      }),
    addCardToMainDeck: (
      cardId: number,
      queryClient: QueryClient,
      limit = CardLimit.UNLIMITED,
    ) =>
      set((state) => {
        const updatedDeck = [...state.mainDeck];
        const numberInDeck = state.mainDeck.filter((ci) => {
          if (ci === cardId) return true;
          const cn = queryClient.getQueryData<CardInfo>(
            queryKeyFactory.cardInfo(ci),
          )?.name;
          const cardName = queryClient.getQueryData<CardInfo>(
            queryKeyFactory.cardInfo(cardId),
          )?.name;
          return cn === cardName;
        }).length;

        if (numberInDeck >= limit.valueOf()) {
          return state;
        }

        updatedDeck.push(cardId);
        return {
          ...state,
          mainDeck: updatedDeck,
        };
      }),
    removeCardFromMainDeck: (cardId: number) =>
      set((state) => {
        const indexOfCard = state.mainDeck.indexOf(cardId);
        if (indexOfCard === -1) {
          return state;
        }
        const updatedDeck = state.mainDeck.filter(
          (_, index) => index !== indexOfCard,
        );
        return {
          ...state,
          mainDeck: updatedDeck,
        };
      }),
    replaceMainDeck: (cardIds: number[]) =>
      set((state) => {
        return {
          ...state,
          mainDeck: cardIds,
        };
      }),
  };
});
