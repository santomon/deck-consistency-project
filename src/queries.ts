import { useQueries, useQuery } from "react-query";
import {
  createLoadingCardInfo,
  createMissingCardInfo,
  getCardInfo,
  queryKeyFactory,
} from "~/utils";
import { useDeckStore, useMainDeck } from "./store";

export const useCardInfoQuery = (cardId: number) => {
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

export const useCardInfoQueries = () => {
  const mainDeck = useMainDeck();

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
