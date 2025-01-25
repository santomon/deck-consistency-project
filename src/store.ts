import { createStore, create } from "zustand";
import { CardGroup, CardId, CardInfo, CardInfoSchema } from "~/types";
import { CardLimit } from "~/constants";
import { QueryClient, useQueryClient } from "react-query";
import { Combo, ComboPiece, GroupId } from "./simulacrum";
import { queryKeyFactory, retrieveCardInfoInternal } from "~/utils";

interface I_DeckState {
  mainDeck: CardId[];
  groups: CardGroup[];
  cardInfoRegister: Map<CardId, CardInfo>;
  comboPieces: ComboPiece[];
  combos: Combo[];
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
  createCombo: () => number;
  removeCombo: (comboId: number) => void;
  addComboPieceToCombo: (comboId: number, comboPiece: ComboPiece) => void;
  changeNumberRequiredForCombo: (
    comboId: number,
    numberRequired: number,
  ) => void;
  changeComboName: (comboId: number, newName: string) => void;
  removeComboPieceFromCombo: (comboId: number, comboPiece: ComboPiece) => void;
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
    comboPieces: [],
    combos: [],
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
    createCombo: () => {
      let newId = -1;
      set((state) => {
        newId = Math.max(...state.combos.map((combo) => combo.id), 0) + 1;
        const newCombo: Combo = {
          id: newId,
          comboPieces: [],
          numberRequired: 0,
          name: `Combo ${newId}`,
        };
        return {
          ...state,
          combos: [...state.combos, newCombo],
        };
      });

      if (newId === -1) {
        throw new Error("Failed to create combo");
      }

      return newId;
    },
    removeCombo: (comboId: number) =>
      set((state) => {
        return {
          ...state,
          combos: state.combos.filter((combo) => combo.id !== comboId),
        };
      }),
    addComboPieceToCombo: (comboId: number, comboPiece: ComboPiece) =>
      set((state) => {
        const updatedCombos = state.combos.map((combo) => {
          if (combo.id !== comboId) {
            return combo;
          }
          return {
            ...combo,
            comboPieces: [...combo.comboPieces, comboPiece],
          };
        });
        return {
          ...state,
          combos: updatedCombos,
        };
      }),
    changeNumberRequiredForCombo: (comboId, numberRequired) =>
      set((state) => {
        const updatedCombos = state.combos.map((combo) => {
          if (combo.id !== comboId) {
            return combo;
          }
          return {
            ...combo,
            numberRequired,
          };
        });
        return {
          ...state,
          combos: updatedCombos,
        };
      }),
    changeComboName: (comboId, newName) =>
      set((state) => {
        const updatedCombos = state.combos.map((combo) => {
          if (combo.id !== comboId) {
            return combo;
          }
          return {
            ...combo,
            name: newName,
          };
        });
        return {
          ...state,
          combos: updatedCombos,
        };
      }),
    removeComboPieceFromCombo: (comboId, comboPiece) =>
      set((state) => {
        const updatedCombos = state.combos.map((combo) => {
          if (combo.id !== comboId) {
            return combo;
          }
          const updatedComboPieces = combo.comboPieces.filter((cp) => {
            return (
              cp.foreignId !== comboPiece.foreignId ||
              cp.type !== comboPiece.type
            );
          });
          return {
            ...combo,
            comboPieces: updatedComboPieces,
          };
        });
        return {
          ...state,
          combos: updatedCombos,
        };
      }),
  };
});

export const useGroups = () => useDeckStore((state) => state.groups);
export const useMainDeck = () => useDeckStore((state) => state.mainDeck);
export const useCombos = () => useDeckStore((state) => state.combos);
export const useCardInfos = () => {
  const mainDeck = useMainDeck();
  const queryClient = useQueryClient();

  const cardInfos = mainDeck
    .map((cardId) => {
      const cardInfo = retrieveCardInfoInternal(cardId, queryClient);
      return cardInfo;
    })
    .reduce((acc, cardInfo) => {
      if (!cardInfo) {
        return acc;
      }
      const alreadyIn = acc.map((ci) => ci.name).includes(cardInfo.name);
      if (alreadyIn) {
        return acc;
      }
      return [...acc, cardInfo];
    }, [] as CardInfo[]);

  return cardInfos;
};
