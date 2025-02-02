import { useQuery, useQueryClient } from "react-query";
import { groupBy, lookUpFrameTypeSortingKey, queryKeyFactory } from "~/utils";
import { useDeckStore, useMainDeck } from "~/store";
import { useCardInfo } from "~/queries";
import { CardInfo, FrameType } from "~/types";

const frameTypeStyleLookup = {
  spell: {
    cellBgColor: "bg-green-800",
  },
  trap: {
    cellBgColor: "bg-pink-700",
  },
  normal: {
    cellBgColor: "bg-amber-200",
  },
  effect: {
    cellBgColor: "bg-orange-400",
  },
  normal_pendulum: {
    cellBgColor: "bg-gradient-to-b from-amber-200 to-teal-300",
  },
  effect_pendulum: {
    cellBgColor: "bg-gradient-to-b from-orange-400 to-teal-300",
  },
  link: {
    cellBgColor: "bg-blue-400",
  },
  synchro: {
    cellBgColor: "bg-stone-50",
  },
  xyz: {
    cellBgColor: "bg-slate-600 text-neutral-100",
  },
  fusion: {
    cellBgColor: "bg-purple-400",
  },
  ritual: {
    cellBgColor: "bg-blue-300",
  },
  default: {
    // i guess if it is in the main deck the chance is high, that it is an effect monster of some sort
    cellBgColor: "bg-gray-600",
  },
};

const CardRow = ({
  cardName,
  count,
  frameType,
}: {
  cardName: string;
  count: number;
  frameType: FrameType;
}) => {
  const styleClassName =
    frameTypeStyleLookup?.[frameType ?? "default"]?.cellBgColor ?? "";

  return (
    <tr className={""}>
      <td className={`${styleClassName} border border-black px-4`}>
        {cardName}
      </td>
      <td className={`${styleClassName} border border-black text-center`}>
        {count}
      </td>
    </tr>
  );
};

const DeckView = ({}) => {
  const queryClient = useQueryClient();

  const mainDeck = useMainDeck();
  const loadedCardInfos = mainDeck
    .map((cardId) => {
      const cardInfo = queryClient.getQueryData<CardInfo>(
        queryKeyFactory.cardInfo(cardId),
      );
      return cardInfo;
    })
    .filter((cardInfo) => !!cardInfo);

  const cardNameInfos = groupBy(loadedCardInfos, (info) => {
    return info.name;
  });

  const sortIDFunction = (a: number, b: number) => {
    const cardInfoA = queryClient.getQueryData<CardInfo>(
      queryKeyFactory.cardInfo(a),
    );
    const cardInfoB = queryClient.getQueryData<CardInfo>(
      queryKeyFactory.cardInfo(b),
    );

    if (!cardInfoA || !cardInfoB) {
      return 0;
    }
    const frameTypeA = cardInfoA.frameType;
    const frameTypeB = cardInfoB.frameType;

    const sortingKeyA = frameTypeA ? lookUpFrameTypeSortingKey(frameTypeA) : 0;
    const sortingKeyB = frameTypeB ? lookUpFrameTypeSortingKey(frameTypeB) : 0;
    const T = -sortingKeyA + sortingKeyB;
    if (T !== 0) {
      return T;
    }
    const cardNameA = cardInfoA.name;
    const cardNameB = cardInfoB.name;
    return cardNameA.localeCompare(cardNameB);
  };

  return (
    <div className={"h-full w-full"}>
      <table className={"w-full table-auto"}>
        <thead>
          <tr className={"from- bg-gray-200"}>
            <th className={"border-gray-500"}>Card Name</th>
            <th className={"border-gray-500"}>Count</th>
          </tr>
        </thead>
        <tbody className={"overflow-auto"}>
          {Object.entries(cardNameInfos).map(([cardName, cardInfos]) => {
            if (cardInfos.length === 0) {
              return null;
            }
            const count = cardInfos.length;
            const frameType = cardInfos[0]?.frameType ?? FrameType.DEFAULT;
            return (
              <CardRow
                key={cardName}
                cardName={cardName}
                count={count}
                frameType={frameType}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DeckView;
