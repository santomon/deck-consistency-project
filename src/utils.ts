import {CardInfo, YGOCardInfoResponseSchema} from "~/types";

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
