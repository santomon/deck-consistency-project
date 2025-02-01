import { createStore, create } from "zustand";
import { CardGroup, CardId, CardInfo, CardInfoSchema } from "~/types";
import { CardLimit } from "~/constants";
import { QueryClient, useQueryClient } from "react-query";
import {
  Combo,
  ComboPiece,
  Condition,
  GroupId,
  HandCondition,
} from "./simulacrum";
import { queryKeyFactory, retrieveCardInfoInternal } from "~/utils";

interface I_DeckState {
  mainDeck: CardId[];
  groups: CardGroup[];
  cardInfoRegister: Map<CardId, CardInfo>;
  combos: Combo[];
  handConditions: HandCondition[];
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
  createHandCondition: () => number;
  removeHandCondition: (handConditionId: number) => void;
  addIncludeConditionToHandCondition: (
    handsConditionId: number,
    condition: Condition,
  ) => void;
  addExcludeConditionToHandCondition: (
    handConditionId: number,
    condition: Condition,
  ) => void;
  removeIncludeConditionFromHandCondition: (
    handConditionId: number,
    condition: Condition,
  ) => void;
  removeExcludeConditionFromHandCondition: (
    handConditionId: number,
    condition: Condition,
  ) => void;
  changeHandConditionName: (handConditionId: number, newName: string) => void;
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
    combos: [],
    handConditions: [],
    cardInfoRegister: new Map(),
    addCardInfo: (cardId, cardInfo) =>
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
    removeGroup: (groupId) =>
      set((state) => {
        return {
          ...state,
          groups: state.groups.filter((group) => group.id !== groupId),
        };
      }),
    changeGroupName: (groupId, newName) =>
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
    addCardToGroup: (groupId, card) =>
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
    removeCardFromGroup: (groupId, card) =>
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
    replaceCardsInGroup: (groupId, cards) =>
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
    addCardToMainDeck: (cardId, queryClient, limit = CardLimit.UNLIMITED) =>
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
    removeCardFromMainDeck: (cardId) =>
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
    replaceMainDeck: (cardIds) =>
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
    removeCombo: (comboId) =>
      set((state) => {
        return {
          ...state,
          combos: state.combos.filter((combo) => combo.id !== comboId),
        };
      }),
    addComboPieceToCombo: (comboId, comboPiece) =>
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
    createHandCondition: () => {
      let newId = -1;
      set((state) => {
        newId = Math.max(...state.handConditions.map((hc) => hc.id), 0) + 1;
        return {
          ...state,
          handConditions: [
            ...state.handConditions,
            {
              id: newId,
              name: `Hand Condition ${newId}`,
              shouldIncludeAtLeastOneOf: [],
              mustNotInclude: [],
            },
          ],
        };
      })
      return newId;
    } ,
    removeHandCondition: (handConditionId: number) =>
      set((state) => {
        return {
          ...state,
          handConditions: state.handConditions.filter(
            (hc) => hc.id !== handConditionId,
          ),
        };
      }),
    addIncludeConditionToHandCondition: (handConditionId, condition) =>
      set((state) => {
        const updatedConditions = state.handConditions.map((hc) => {
          if (hc.id !== handConditionId) {
            return hc;
          }
          return {
            ...hc,
            shouldIncludeAtLeastOneOf: [
              ...hc.shouldIncludeAtLeastOneOf,
              condition,
            ],
          };
        });
        return {
          ...state,
          handConditions: updatedConditions,
        };
      }),
    addExcludeConditionToHandCondition: (handConditionId, condition) =>
      set((state) => {
        const updatedConditions = state.handConditions.map((hc) => {
          if (hc.id !== handConditionId) {
            return hc;
          }
          return {
            ...hc,
            mustNotInclude: [...hc.mustNotInclude, condition],
          };
        });
        return {
          ...state,
          handConditions: updatedConditions,
        };
      }),
    removeIncludeConditionFromHandCondition: (handConditionId, condition) =>
      set((state) => {
        const updatedConditions = state.handConditions.map((hc) => {
          if (hc.id !== handConditionId) {
            return hc;
          }
          return {
            ...hc,
            shouldIncludeAtLeastOneOf: hc.shouldIncludeAtLeastOneOf.filter(
              (c) =>
                c.foreignId !== condition.foreignId ||
                c.type !== condition.type,
            ),
          };
        });
        return {
          ...state,
          handConditions: updatedConditions,
        };
      }),
    removeExcludeConditionFromHandCondition: (handConditionId, condition) =>
      set((state) => {
        const updatedConditions = state.handConditions.map((hc) => {
          if (hc.id !== handConditionId) {
            return hc;
          }
          return {
            ...hc,
            mustNotInclude: hc.mustNotInclude.filter(
              (c) =>
                c.foreignId !== condition.foreignId ||
                c.type !== condition.type,
            ),
          };
        });
        return {
          ...state,
          handConditions: updatedConditions,
        };
      }),
    changeHandConditionName: (handConditionId, newName) =>
      set((state) => {
        const updatedConditions = state.handConditions.map((hc) => {
          if (hc.id !== handConditionId) {
            return hc;
          }
          return {
            ...hc,
            name: newName,
          };
        });
        return {
          ...state,
          handConditions: updatedConditions,
        };
      }),
  };
});

export const useGroups = () => useDeckStore((state) => state.groups);
export const useMainDeck = () => useDeckStore((state) => state.mainDeck);
export const useCombos = () => useDeckStore((state) => state.combos);
export const useHandConditions = () => {
  const handConditions = useDeckStore((state) => state.handConditions);
  const changeHandConditionName = useDeckStore(
    (state) => state.changeHandConditionName,
  );
  const createHandCondition = useDeckStore(
    (state) => state.createHandCondition,
  );
  const removeHandCondition = useDeckStore(
    (state) => state.removeHandCondition,
  );
  const addIncludeConditionToHandCondition = useDeckStore(
    (state) => state.addIncludeConditionToHandCondition,
  );
  const addExcludeConditionToHandCondition = useDeckStore(
    (state) => state.addExcludeConditionToHandCondition,
  );
  const removeIncludeConditionFromHandCondition = useDeckStore(
    (state) => state.removeIncludeConditionFromHandCondition,
  );
  const removeExcludeConditionFromHandCondition = useDeckStore(
    (state) => state.removeExcludeConditionFromHandCondition,
  );
  return {
    handConditions,
    changeHandConditionName,
    createHandCondition,
    removeHandCondition,
    addIncludeConditionToHandCondition,
    addExcludeConditionToHandCondition,
    removeIncludeConditionFromHandCondition,
    removeExcludeConditionFromHandCondition,
  };
};
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
