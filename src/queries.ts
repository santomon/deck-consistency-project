import { useQueries, useQuery } from "react-query";
import {getCardInfo, queryKeyFactory} from "~/utils";
import { useDeckStore } from "./store";

export const useCardInfo = (cardId: number) => {
    const mainDeck = useDeckStore((state) => state.mainDeck);
    return useQuery(
        queryKeyFactory.cardInfo(cardId),
        async () => {
            const cards = await getCardInfo([cardId])
            return cards[0]
        },
    )
}

export const useCardInfos = () => {
    const mainDeck = useDeckStore((state) => state.mainDeck);

    return useQueries(
        Array.from(mainDeck).map(([cardId, count]) => {
            return {
                queryKey: queryKeyFactory.cardInfo(cardId),
                queryFn: async () => {
                    const cards = await getCardInfo([cardId])
                    return cards[0]
                },
            };
        }),
    )
}