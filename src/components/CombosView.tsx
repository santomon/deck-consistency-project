import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import {
  useCardInfos,
  useCombos,
  useDeckStore,
  useGroups,
  useMainDeck,
} from "~/store";
import { useDebouncedCallback } from "~/hooks";
import { CardInfo, Combo, ComboPiece } from "~/types";
import { retrieveCardInfoInternal } from "~/utils";
import DialogBox from "~/components/Dialogbox";
import { AutoSelect } from "~/components/AutoSelect";
import { ChipSSF } from "~/components/ChipSSF";

const CombosView = () => {
  const [createComboDialogBoxIsOpen, setCreateComboDialogBoxIsOpen] =
    useState(false);
  const [activeComboId, setActiveComboId] = useState<number | null>(null);
  const [comboNameProxy, setComboNameProxy] = useState("");
  const groups = useGroups();
  const combos = useCombos();
  const cardInfos = useCardInfos();
  const createCombo = useDeckStore((state) => state.createCombo);
  const removeCombo = useDeckStore((state) => state.removeCombo);
  const addComboPieceToCombo = useDeckStore(
    (state) => state.addComboPieceToCombo,
  );
  const removeComboPieceFromCombo = useDeckStore(
    (state) => state.removeComboPieceFromCombo,
  );
  const changeComboName = useDeckStore((state) => state.changeComboName);
  const debouncedChangeComboName = useDebouncedCallback(
    ({ comboId, value }: { comboId: number; value: string }) => {
      changeComboName(comboId, value);
    },
    500,
  );
  const changeNumberRequiredForCombo = useDeckStore(
    (state) => state.changeNumberRequiredForCombo,
  );

  const handleCreateCombo = () => {
    const newComboId = createCombo();
    setActiveComboId(newComboId);
    setCreateComboDialogBoxIsOpen(true);
  };

  const handleOptionSelected = (comboPiece: ComboPiece) => {
    if (activeComboId === null) {
      return;
    }
    addComboPieceToCombo(activeComboId, comboPiece);
  };

  const getComboPieceHash = (comboPiece: ComboPiece) => {
    return `${comboPiece.type}-${comboPiece.foreignId}`;
  };

  const getNameFromComboPiece = (comboPiece: ComboPiece) => {
    if (comboPiece.type === "group") {
      const groupName = groups.find(
        (group) => group.id === comboPiece.foreignId,
      )?.name;
      if (groupName) {
        return groupName;
      } else {
        throw new Error(`Invalid group id ${comboPiece.foreignId}`);
      }
    } else if (comboPiece.type === "card") {
      const cardName = cardInfos.find(
        (cardInfo) => cardInfo.id === comboPiece.foreignId,
      )?.name;
      if (cardName) {
        return cardName;
      } else {
        throw new Error(`Invalid card id ${comboPiece.foreignId}`);
      }
    }
    throw new Error("Invalid combo piece type");
  };

  const handleDebouncedChangeComboName = (
    comboId: number | null,
    value: string,
  ) => {
    if (comboId === null) {
      return;
    }
    setComboNameProxy(value);
    debouncedChangeComboName({ comboId, value });
  };

  useEffect(() => {
    if (activeComboId === null) {
      return;
    }
    setComboNameProxy(
      combos.find((combo) => combo.id === activeComboId)?.name ?? "",
    );
  }, [activeComboId, combos]);

  const activeCombo = combos.find((combo) => combo.id === activeComboId);
  const activeComboPieces = activeCombo?.comboPieces ?? [];

  const groupOptions: ComboPiece[] = groups.map((group) => {
    return {
      type: "group",
      foreignId: group.id,
    };
  });

  const cardOptions: ComboPiece[] = cardInfos.map((cardInfo) => {
    return {
      type: "card",
      foreignId: cardInfo.id,
    };
  });

  return (
    <>
      <DialogBox
        isOpen={createComboDialogBoxIsOpen}
        onClose={() => {
          setCreateComboDialogBoxIsOpen(false);
          setActiveComboId(null);
          setComboNameProxy("");
        }}
      >
        <label> Combo Name </label>
        <input
          id="textInput"
          type="text"
          value={comboNameProxy}
          onChange={(e) =>
            handleDebouncedChangeComboName(activeComboId, e.target.value)
          }
          placeholder="Type something..."
          className="w-80 rounded-md border border-gray-300 py-2 pl-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <AutoSelect
          options={[...groupOptions, ...cardOptions]}
          selectedOptions={activeComboPieces}
          getOptionsKey={getComboPieceHash}
          getOptionsLabel={getNameFromComboPiece}
          handleOnSelect={handleOptionSelected}
        />
        <input
          value={activeCombo?.numberRequired}
          className={
            "w-80 rounded-md border border-gray-300 py-2 pl-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
          onChange={(e) => {
            if (activeComboId === null || isNaN(parseInt(e.target.value))) {
              return;
            }
            changeNumberRequiredForCombo(
              activeComboId,
              parseInt(e.target.value),
            );
          }}
        />
        <div className={"rounded bg-gray-500"}>
          {combos
            .find((combo) => combo.id === activeComboId)
            ?.comboPieces.map((comboPiece) => {
              return (
                <ChipSSF
                  key={getComboPieceHash(comboPiece)}
                  label={getNameFromComboPiece(comboPiece)}
                  onDelete={() => {
                    if (activeComboId === null) {
                      return;
                    }
                    removeComboPieceFromCombo(activeComboId, comboPiece);
                  }}
                />
              );
            })}
        </div>
      </DialogBox>
      <div>
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-bold">Combos</h3>
          <ul className="space-y-4">
            {combos.map((combo) => (
              <li
                key={combo.id}
                className="flex items-center justify-between rounded-md border border-gray-300 p-4"
              >
                <div>
                  <h4 className="text-sm font-medium">{combo.name}</h4>
                  <p className="text-xs text-gray-500">
                    Pieces:{" "}
                    {combo.comboPieces
                      .map((comboPiece) => {
                        return getNameFromComboPiece(comboPiece);
                      })
                      .join(", ")}
                  </p>
                </div>
                Number required: {combo.numberRequired}
                <button
                  onClick={() => {
                    setActiveComboId(combo.id);
                    setCreateComboDialogBoxIsOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    removeCombo(combo.id);
                  }}
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleCreateCombo}>Create Combo</button>
      </div>
    </>
  );
};

export default CombosView;
