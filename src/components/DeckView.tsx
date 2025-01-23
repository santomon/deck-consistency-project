import { useQuery, useQueryClient } from "react-query";
import { queryKeyFactory } from "~/utils";
import { useDeckStore } from "~/store";

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
  default: {  // i guess if it is in the main deck the chance is high, that it is an effect monster of some sort
    cellBgColor: "bg-gray-600",
  }
};

const CardRow = ( {cardId}: {cardId: number}) => {
  const {data: cardInfo, isSuccess} = useQuery(queryKeyFactory.cardInfo(cardId))

}

const DeckView = ({}) => {
  const queryClient = useQueryClient();
  const mainDeck = useDeckStore((state) => state.mainDeck);

  return (
    <div className={""}>
      <table className={"table-auto"}>
        <thead>
          <tr className={"bg-gray-200 from-"}>
            <th className={"border-gray-500"}>Card Name</th>
            <th className={"border-gray-500"}>Count</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default DeckView;
