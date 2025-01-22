import {createStore} from 'zustand';

interface I_State {
    mainDeckIds: number[]
}

const useStore = createStore<I_State>((set) => {
    return {
        mainDeckIds: [],
        addCardsToMainDeck: (cardIds: number[]) => set((state) => {
            const toAdd = []
            for (const cardId of cardIds) {
                const nInMainDeck = state.mainDeckIds.filter((ci) => ci === cardId).length
                const nInToAdd = toAdd.filter((ci) => ci === cardId).length
                if (nInMainDeck + nInToAdd >= 3) {
                    continue
                }
                toAdd.push(cardId)
            }

            return {
                ...state,
                mainDeckIds: [...state.mainDeckIds, ...toAdd]
            }
        }),
        removeCardsFromMainDeck: (cardIds: number[]) => set((state) => {
            let newMainDeckIds = [...state.mainDeckIds]
            for (const cardId of cardIds) {
                const index = newMainDeckIds.findIndex((ci) => ci === cardId)
                if (index === -1) {
                    continue
                }
                newMainDeckIds = newMainDeckIds.filter((ci, i) => i !== index)
            }
            return {
                ...state,
                mainDeckIds: newMainDeckIds
            }
        }),
    }

})
