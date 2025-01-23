import { useQuery, useQueryClient } from "react-query";
import { queryKeyFactory } from "~/utils";
import { useDeckStore } from "~/store";
import { useCardInfo } from "~/queries";

const frameTypeStyleLookup = {
  spell: {
    cellBgColor: "bg-green-800",
  },
  trap: {
    cellBgColor: "bg-pink-700",
  },
  normal: {
    cellBgColor: "bg-amber-300",
  },
  effect: {
    cellBgColor: "bg-amber-600",
  },
  effect_pendulum: {
    cellBgColor: "bg-gradient-to-b from-amber-600 to-green-600",
  },
  default: {
    // i guess if it is in the main deck the chance is high, that it is an effect monster of some sort
    cellBgColor: "bg-gray-600",
  },
};

const CardRow = ({ cardId }: { cardId: number }) => {
  const { data: cardInfo, isSuccess, isLoading } = useCardInfo(cardId);
  const mainDeck = useDeckStore((state) => state.mainDeck);
  const count = mainDeck.get(cardId) ?? 0;

  if (isLoading) {
    return (
      <tr>
        <td>Loading...</td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{cardInfo?.[0]?.name}</td>
      <td>{count}</td>
    </tr>
  );
};

const DeckView = ({}) => {
  const queryClient = useQueryClient();
  const mainDeck = useDeckStore((state) => state.mainDeck);

  return (
    <div className={""}>
      <table className={"table-auto"}>
        <thead>
          <tr className={"from- bg-gray-200"}>
            <th className={"border-gray-500"}>Card Name</th>
            <th className={"border-gray-500"}>Count</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(mainDeck).map(([cardId, count]) => {
            return <CardRow cardId={cardId} key={cardId} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DeckView;
