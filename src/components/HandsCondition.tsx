import { useEffect, useState } from "react";
import {
  useCardInfos,
  useCombos,
  useDeckStore,
  useGroups,
  useHandConditions,
} from "~/store";
import { useDebouncedCallback } from "~/components/hooks";
import { Condition, HandConditionWhere } from "~/types";
import DialogBox from "~/components/Dialogbox";
import { AutoSelect } from "~/components/AutoSelect";
import { ChipSSF } from "~/components/ChipSSF";

const HandsCondition = () => {
  const [
    createHandConditionDialogBoxIsOpen,
    setCreateHandConditionDialogBoxIsOpen,
  ] = useState(false);
  const [activeHandConditionId, setActiveHandConditionId] = useState<
    number | null
  >(null);
  const [handConditionNameProxy, setHandConditionNameProxy] = useState("");
  const groups = useGroups();
  const combos = useCombos();
  const cardInfos = useCardInfos();

  const {
    addExcludeConditionToHandCondition,
    addIncludeConditionToHandCondition,
    changeHandConditionName,
    createHandCondition,
    handConditions,
    removeExcludeConditionFromHandCondition,
    removeHandCondition,
    removeIncludeConditionFromHandCondition,
  } = useHandConditions();

  const debouncedChangeHandConditionName = useDebouncedCallback(
    ({
      handConditionId,
      value,
    }: {
      handConditionId: number;
      value: string;
    }) => {
      changeHandConditionName(handConditionId, value);
    },
    500,
  );

  const handleCreateHandCondition = () => {
    const condition = createHandCondition();
    setActiveHandConditionId(condition);
    setCreateHandConditionDialogBoxIsOpen(true);
  };

  const handleOptionSelected = (
    condition: Condition,
    where: HandConditionWhere,
  ) => {
    if (activeHandConditionId === null) {
      return;
    }
    switch (where) {
      case "include":
        addIncludeConditionToHandCondition(activeHandConditionId, condition);
        break;
      case "exclude":
        addExcludeConditionToHandCondition(activeHandConditionId, condition);
        break;
    }
  };

  const getConditionHash = (condition: Condition) => {
    return `${condition.type}-${condition.foreignId}`;
  };

  const getNameFromCondition = (condition: Condition) => {
    if (condition.type === "combo") {
      const comboName = combos.find(
        (combo) => combo.id === condition.foreignId,
      )?.name;
      if (comboName) {
        return comboName;
      }
      throw new Error(`could not get name for combo id ${condition.foreignId}`);
    } else if (condition.type === "group") {
      const groupName = groups.find(
        (group) => group.id === condition.foreignId,
      )?.name;
      if (groupName) {
        return groupName;
      } else {
        throw new Error(
          `could not get name for group id ${condition.foreignId}`,
        );
      }
    } else if (condition.type === "card") {
      return condition.foreignId.toString();
    }
    throw new Error("Invalid combo piece type");
  };

  const handleDebouncedChangeHandConditionName = (
    handConditionId: number | null,
    value: string,
  ) => {
    if (handConditionId === null) {
      return;
    }
    setHandConditionNameProxy(value);
    debouncedChangeHandConditionName({ handConditionId, value });
  };

  useEffect(() => {
    if (activeHandConditionId === null) {
      return;
    }
    setHandConditionNameProxy(
      handConditions.find(
        (handCondition) => handCondition.id === activeHandConditionId,
      )?.name ?? "",
    );
  }, [activeHandConditionId, handConditions]);

  const activeHandCondition = handConditions.find(
    (handCondition) => handCondition.id === activeHandConditionId,
  );
  const activeConditionsShouldIncludeAtLeastOneOf =
    activeHandCondition?.shouldIncludeAtLeastOneOf ?? [];
  const activeConditionsMustNotInclude =
    activeHandCondition?.mustNotInclude ?? [];

  const comboOptions: Condition[] = combos.map((combo) => {
    return {
      type: "combo",
      foreignId: combo.id,
    };
  });

  const groupOptions: Condition[] = groups.map((group) => {
    return {
      type: "group",
      foreignId: group.id,
    };
  });

  const cardOptions: Condition[] = cardInfos.map((cardInfo) => {
    return {
      type: "card",
      foreignId: cardInfo.name,
    };
  });

  return (
    <>
      <DialogBox
        isOpen={createHandConditionDialogBoxIsOpen}
        onClose={() => {
          setCreateHandConditionDialogBoxIsOpen(false);
          setActiveHandConditionId(null);
          setHandConditionNameProxy("");
        }}
      >
        <label> Hand Condition Name </label>
        <input
          id="textInput"
          type="text"
          value={handConditionNameProxy}
          onChange={(e) =>
            handleDebouncedChangeHandConditionName(
              activeHandConditionId,
              e.target.value,
            )
          }
          placeholder="Type something..."
          className="w-80 rounded-md border border-gray-300 py-2 pl-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <AutoSelect
          options={[...groupOptions, ...cardOptions, ...comboOptions]}
          selectedOptions={activeConditionsShouldIncludeAtLeastOneOf}
          getOptionsKey={getConditionHash}
          getOptionsLabel={getNameFromCondition}
          handleOnSelect={(condition) =>
            handleOptionSelected(condition, "include")
          }
        />
        <AutoSelect
          options={[...groupOptions, ...cardOptions, ...comboOptions]}
          selectedOptions={activeConditionsMustNotInclude}
          getOptionsKey={getConditionHash}
          getOptionsLabel={getNameFromCondition}
          handleOnSelect={(condition) =>
            handleOptionSelected(condition, "exclude")
          }
        />
        <div className={"rounded bg-gray-500"}>
          {handConditions
            .find((handCondition) => handCondition.id === activeHandConditionId)
            ?.shouldIncludeAtLeastOneOf.map((condition) => {
              return (
                <ChipSSF
                  key={getConditionHash(condition)}
                  label={getNameFromCondition(condition)}
                  onDelete={() => {
                    if (activeHandConditionId === null) {
                      return;
                    }
                    removeIncludeConditionFromHandCondition(
                      activeHandConditionId,
                      condition,
                    );
                  }}
                />
              );
            })}
        </div>
        <div className={"rounded bg-gray-700"}>
          {handConditions
            .find((handCondition) => handCondition.id === activeHandConditionId)
            ?.mustNotInclude.map((condition) => {
              return (
                <ChipSSF
                  key={getConditionHash(condition)}
                  label={getNameFromCondition(condition)}
                  onDelete={() => {
                    if (activeHandConditionId === null) {
                      return;
                    }
                    removeExcludeConditionFromHandCondition(
                      activeHandConditionId,
                      condition,
                    );
                  }}
                />
              );
            })}
        </div>
      </DialogBox>
      <div>
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-bold">Hand Conditions</h3>
          <ul className="space-y-4">
            {handConditions.map((handCondition) => (
              <li
                key={handCondition.id}
                className="flex items-center justify-between rounded-md border border-gray-300 p-4"
              >
                <div>
                  <h4 className="text-sm font-medium">{handCondition.name}</h4>
                  <p className="text-xs text-gray-500">
                    Should Include one of:{" "}
                    {handCondition.shouldIncludeAtLeastOneOf
                      .map((condition) => {
                        return getNameFromCondition(condition);
                      })
                      .join(", ")}
                  </p>
                  <p className="text-xs text-gray-700">
                    Must Not Include:{" "}
                    {handCondition.mustNotInclude
                      .map((condition) => {
                        return getNameFromCondition(condition);
                      })
                      .join(", ")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveHandConditionId(handCondition.id);
                    setCreateHandConditionDialogBoxIsOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    removeHandCondition(handCondition.id);
                  }}
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleCreateHandCondition}>Create Combo</button>
      </div>
    </>
  );
};

export default HandsCondition;
