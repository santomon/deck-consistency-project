import { useEffect, useState } from "react";
import DialogBox from "~/components/Dialogbox";
import { useCardInfos, useDeckStore, useGroups, useMainDeck } from "~/store";
import { useDebouncedCallback } from "~/hooks";
import { useQueryClient } from "react-query";
import { CardInfo } from "~/types";
import { retrieveCardInfoInternal } from "~/utils";
import { AutoSelect } from "~/components/AutoSelect";
import { ChipSSF } from "~/components/ChipSSF";
import ContentCard from "~/components/ContentCard";

const GroupView = () => {
  const [createGroupDialogBoxIsOpen, setCreateGroupDialogBoxIsOpen] =
    useState(false);
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [groupNameProxy, setGroupNameProxy] = useState("");
  const queryClient = useQueryClient();
  const mainDeck = useMainDeck();
  const groups = useGroups();
  const createGroup = useDeckStore((state) => state.createGroup);
  const removeGroup = useDeckStore((state) => state.removeGroup);
  const removeCardFromGroup = useDeckStore(
    (state) => state.removeCardFromGroup,
  );
  const addCardToGroup = useDeckStore((state) => state.addCardToGroup);
  const changeGroupName = useDeckStore((state) => state.changeGroupName);
  const cardInfos = useCardInfos();
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
          <div className="flex flex-wrap gap-4">
            {groups.map((group) => (
              <ContentCard
                title={group.name}
                key={group.id}
                editCallback={() => {
                  setActiveGroupId(group.id);
                  setCreateGroupDialogBoxIsOpen(true);
                }}
                deleteCallback={() => {
                  removeGroup(group.id);
                }}
              >
                <div>
                  <p className="text-xs text-gray-500">
                    Cards: {group.cards.join(", ")}
                  </p>
                </div>
              </ContentCard>
            ))}
          </div>
        </div>
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>
    </>
  );
};

export default GroupView;
