import { useEffect, useState } from "react";
import DialogBox from "~/components/Dialogbox";
import { useDeckStore } from "~/store";
import { useDebouncedCallback } from "~/components/hooks";
import { useQueryClient } from "react-query";
import { CardInfo } from "~/types";
import { retrieveCardInfoInternal } from "~/utils";
import { AutoSelect } from "~/components/AutoSelect";
import { ChipSSF } from "~/components/ChipSSF";

const GroupView = () => {
  const [createGroupDialogBoxIsOpen, setCreateGroupDialogBoxIsOpen] =
    useState(false);
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [groupNameProxy, setGroupNameProxy] = useState("");
  const queryClient = useQueryClient();
  const mainDeck = useDeckStore((state) => state.mainDeck);
  const groups = useDeckStore((state) => state.groups);
  const createGroup = useDeckStore((state) => state.createGroup);
  const removeGroup = useDeckStore((state) => state.removeGroup);
  const removeCardFromGroup = useDeckStore(
    (state) => state.removeCardFromGroup,
  );
  const addCardToGroup = useDeckStore((state) => state.addCardToGroup);
  const changeGroupName = useDeckStore((state) => state.changeGroupName);
  const debouncedGroupNameChange = useDebouncedCallback(
    ({ groupId, value }: { groupId: number; value: string }) => {
      changeGroupName(groupId, value);
    },
    500,
  );
  const handleCreateGroup = () => {
    const newGroupId = createGroup();
    setActiveGroupId(newGroupId);
    setCreateGroupDialogBoxIsOpen(true);
  };

  const handleOptionSelected = (selectedCard: CardInfo) => {
    if (activeGroupId === null) {
      return;
    }
    addCardToGroup(activeGroupId, selectedCard.name);
  };

  const getIdFromCard = (card: CardInfo) => {
    return card.id.toString();
  };

  const getNameFromCard = (card: CardInfo) => {
    return card.name;
  };

  const handleDebounceGroupNameChange = (
    groupId: number | null,
    value: string,
  ) => {
    if (groupId === null) {
      return;
    }
    setGroupNameProxy(value);
    debouncedGroupNameChange({ groupId, value });
  };

  useEffect(() => {
    if (activeGroupId === null) {
      return;
    }
    setGroupNameProxy(
      groups.find((group) => group.id === activeGroupId)?.name ?? "",
    );
  }, [activeGroupId, groups]);

  const cardInfos = mainDeck
    .map((cardId) => {
      const cardInfo = retrieveCardInfoInternal(cardId, queryClient);
      return cardInfo;
    })
    .reduce((acc, cardInfo) => {
      if (!cardInfo) {
        return acc;
      }
      const alreadyIn = acc.map((ci) => ci.name).includes(cardInfo.name);
      if (alreadyIn) {
        return acc;
      }
      return [...acc, cardInfo];
    }, [] as CardInfo[]);

  const activeGroup = groups.find((group) => group.id === activeGroupId);
  const activeGroupCardInfos = cardInfos
    .filter((cardInfo) => {
      return !!cardInfo;
    })
    .filter((cardInfo) => {
      return !!activeGroup && activeGroup.cards.includes(cardInfo.name);
    });

  return (
    <>
      <DialogBox
        isOpen={createGroupDialogBoxIsOpen}
        onClose={() => {
          setCreateGroupDialogBoxIsOpen(false);
          setActiveGroupId(null);
          setGroupNameProxy("");
        }}
      >
        <label> Card Group Name </label>
        <input
          id="textInput"
          type="text"
          value={groupNameProxy}
          onChange={(e) =>
            handleDebounceGroupNameChange(activeGroupId, e.target.value)
          }
          placeholder="Type something..."
          className="w-80 rounded-md border border-gray-300 py-2 pl-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <AutoSelect
          options={cardInfos.filter((cardInfo) => !!cardInfo)}
          selectedOptions={activeGroupCardInfos}
          getOptionsKey={getIdFromCard}
          getOptionsLabel={getNameFromCard}
          handleOnSelect={handleOptionSelected}
        />
        <div className={"rounded bg-gray-500"}>
          {groups
            .find((group) => group.id === activeGroupId)
            ?.cards.map((card) => {
              return (
                <ChipSSF
                  key={card}
                  label={card}
                  onDelete={() => {
                    if (activeGroupId === null) {
                      return;
                    }
                    removeCardFromGroup(activeGroupId, card);
                  }}
                />
              );
            })}
        </div>
      </DialogBox>
      <div>
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-bold">Existing Groups</h3>
          <ul className="space-y-4">
            {groups.map((group) => (
              <li
                key={group.id}
                className="flex items-center justify-between rounded-md border border-gray-300 p-4"
              >
                <div>
                  <h4 className="text-sm font-medium">{group.name}</h4>
                  <p className="text-xs text-gray-500">
                    Cards: {group.cards.join(", ")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveGroupId(group.id);
                    setCreateGroupDialogBoxIsOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    removeGroup(group.id);
                  }}
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>
    </>
  );
};

export default GroupView;
