import { useQueries, useQuery } from "react-query";
import {
  createLoadingCardInfo,
  createMissingCardInfo,
  getCardInfo,
  queryKeyFactory,
} from "~/utils";
import { useDeckStore } from "./store";

export const useCardInfo = (cardId: number) => {
  const mainDeck = useDeckStore((state) => state.mainDeck);
  return useQuery(
    queryKeyFactory.cardInfo(cardId),
    async () => {
      const cards = await getCardInfo([cardId]);
      return cards[0];
    },
    {
      initialData: createMissingCardInfo,
      placeholderData: createLoadingCardInfo,
    },
  );
};

export const useCardInfos = () => {
  const mainDeck = useDeckStore((state) => state.mainDeck);

  return useQueries(
    mainDeck.map((cardId) => {
      return {
        queryKey: queryKeyFactory.cardInfo(cardId),
        queryFn: async () => {
          const cards = await getCardInfo([cardId]);
          return cards[0];
        },
        initialData: createMissingCardInfo,
        placeHolderData: createLoadingCardInfo,
      };
    }),
  );
};
