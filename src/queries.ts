import { useQueries, useQuery } from "react-query";
import {getCardInfo, queryKeyFactory} from "~/utils";
import { useDeckStore } from "./store";

const useCardInfo = (cardId: number) => {
    const mainDeck = useDeckStore((state) => state.mainDeck);
    return useQuery(
        queryKeyFactory.cardInfo(cardId),
        () => getCardInfo([cardId]),
        {
            initialData: [],
        }
    )
}

export const useCardInfos = () => {
    const mainDeck = useDeckStore((state) => state.mainDeck);

    return useQueries(
        Array.from(mainDeck).map(([cardId, count]) => {
            return {
                queryKey: queryKeyFactory.cardInfo(cardId),
                queryFn: () => getCardInfo([cardId]),
                initialData: [],
            };
        }),
    )
}