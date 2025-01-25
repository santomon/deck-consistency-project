import {
  CardId,
  CardInfo,
  FrameType,
  YGOCardInfoResponseSchema,
} from "~/types";
import { QueryClient } from "react-query";

export const queryKeyFactory = {
  cardInfo: (cardId: number) => ["cardInfo", cardId],
};

const createPlaceHolderCardInfoResponse = (): CardInfo[] => {
  return [];
};

export const getCardInfo = async (cardIds?: number[]) => {
  const commaSeparatedIds = cardIds?.join(",");
  if (!commaSeparatedIds) {
    return createPlaceHolderCardInfoResponse();
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CIENTVAR_YGO_CARD_INFO_API_BASE_URL}?id=${commaSeparatedIds}`,
  );
  const responseData = YGOCardInfoResponseSchema.parse(await response.json());
  return responseData.data;
};

export const retrieveCardInfoInternal = (
  cardId: CardId,
  queryClient: QueryClient,
) => {
  const cardInfo = queryClient.getQueryData<CardInfo>(
    queryKeyFactory.cardInfo(cardId),
  );
  return cardInfo;
};

export const lookUpFrameTypeSortingKey = (frameType: string) => {
  if ((frameType as FrameType) === FrameType.EFFECT) {
    return 4;
  } else if ((frameType as FrameType) === FrameType.NORMAL) {
    return 1;
  } else if ((frameType as FrameType) === FrameType.SPELL) {
    return 0;
  } else if ((frameType as FrameType) === FrameType.TRAP) {
    return -1;
  } else {
    return 2;
  }
};

export const groupBy = <T, K extends string | number | symbol>(
  array: T[],
  keyFn: (element: T) => K,
) => {
  return array.reduce(
    (acc, element) => {
      const key = keyFn(element);
      acc[key] = acc[key] || [];
      acc[key].push(element);
      return acc;
    },
    {} as Record<K, T[]>,
  );
};
export const createMissingCardInfo = (): CardInfo => {
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
export const createLoadingCardInfo = (): CardInfo => {
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
