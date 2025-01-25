import { useQueries, useQuery } from "react-query";
import { getCardInfo, queryKeyFactory } from "~/utils";
import { useDeckStore } from "./store";
import { CardInfo, FrameType } from "~/types";

const createMissingCardInfo = (): CardInfo => {
  return {
    id: -1,
    name: "CARD NOT FOUND",
    typeline: [],
    type: "Effect Monster",
    humanReadableCardType: "Effect Monster",
    frameType: FrameType.DEFAULT,
    desc: "",
    race: "",
    atk: 0,
    def: 0,
    level: 1,
    attribute: "LIGHT",
    ygoprodeck_url: "",
    card_sets: [],
    card_images: [],
    card_prices: [],
  };
};

const createLoadingCardInfo = (): CardInfo => {
  return {
    id: -1,
    name: "Loading...",
    typeline: [],
    type: "Effect Monster",
    humanReadableCardType: "Effect Monster",
    frameType: FrameType.DEFAULT,
    desc: "",
    race: "",
    atk: 0,
    def: 0,
    level: 1,
    attribute: "LIGHT",
    ygoprodeck_url: "",
    card_sets: [],
    card_images: [],
    card_prices: [],
  };
};

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
