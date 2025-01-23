import {createStore, create} from 'zustand';
import {CardInfoSchema} from "~/types";
import {CardLimit} from "~/constants";

interface I_State {
    mainDeck: Map<number, number>
    addCardToMainDeck: (cardId: number[], limit: CardLimit) => void
    removeCardFromMainDeck: (cardId: number) => void
    replaceMainDeck: (cardIds: number[]) => void
}

const countElements = (elements: number[]):  Map<number, number> => {
    const countMap = new Map<number, number>();
    for (const element of elements) {
        countMap.set(element, (countMap.get(element) ?? 0) + 1);
    }
    return countMap;
}

export const useDeckStore = create<I_State>((set) => {
    return {
        mainDeck: new Map(),
        loadedCardInfo: [],
        addCardToMainDeck: (cardId: number, limit = CardLimit.UNLIMITED ) => set((state) => {
            const updatedDeck = new Map(state.mainDeck)
            updatedDeck.set(cardId, Math.min(updatedDeck.get(cardId) ?? 1, limit))

            return {
                ...state,
                mainDeck: updatedDeck
            }
        }),
        removeCardFromMainDeck: (cardId: number) => set((state) => {
            const updatedDeck = new Map(state.mainDeck)
            const currentValue = updatedDeck.get(cardId)
            if (!currentValue) {
                return state
            } else if (currentValue <= 1) {
                updatedDeck.delete(cardId)
            } else {
                updatedDeck.set(cardId, currentValue - 1)
            }
            return {
                ...state,
                mainDeckIds: updatedDeck
            }
        }),
        replaceMainDeck: (cardIds: number[]) => set((state) => {
            const newDeck = countElements(cardIds)
            return {
                ...state,
                mainDeckIds: newDeck
            }
        }),
    }

})
