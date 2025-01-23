import {CardInfo, FrameType, YGOCardInfoResponseSchema} from "~/types";

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


export const lookUpFrameTypeSortingKey = (frameType: string) => {
  if (frameType === FrameType.EFFECT) {
    return 4;
  } else if (frameType === FrameType.NORMAL) {
    return 1;
  } else if (frameType === FrameType.SPELL) {
    return 0;
  } else {
    return 2;
  }
}