import { useQueryClient } from "react-query";
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
};

const DeckView = ({}) => {
  const queryClient = useQueryClient();
  const mainDeck = useDeckStore((state) => state.mainDeck);

  return (
    <div className={""}>
      <table className={"table-auto"}>
        <thead>
          <tr className={"bg-gray-200"}>
            <th className={"border-gray-500"}>Card Name</th>
            <th className={"border-gray-500"}>Count</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default DeckView;
