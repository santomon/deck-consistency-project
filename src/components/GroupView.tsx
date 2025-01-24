import { ChangeEventHandler, FC, useEffect, useRef, useState } from "react";
import DialogBox from "~/components/Dialogbox";
import { useDeckStore } from "~/store";
import { useDebouncedCallback } from "~/components/hooks";
import { useQueryClient } from "react-query";
import { CardInfo } from "~/types";
import {
  getCardInfo,
  queryKeyFactory,
  retrieveCardInfoInternal,
} from "~/utils";

interface AutoSelectProps<T> {
  options: T[];
  getOptionsKey: (option: T) => string;
  getOptionsLabel: (option: T) => string;
  handleSelectedOptionsChanged: (selectedOptions: T[]) => void;
}

const AutoSelect = <T,>({
  options,
  getOptionsKey,
  getOptionsLabel,
  handleSelectedOptionsChanged,
}: AutoSelectProps<T>) => {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<T[]>([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const searchFilterPredicate = (_option: T) => {
    return getOptionsLabel(_option)
      .toLowerCase()
      .includes(searchFilter.toLowerCase());
  };

  const notSelectedPredicate = (_option: T) => {
    return !selectedOptions.some(
      (option) => getOptionsKey(option) === getOptionsKey(_option),
    );
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setSearchFilter(value);
  };

  // Handle option selection
  const handleOptionSelect = (option: T) => {
    setSearchFilter("");
    setDropdownVisible(false);
    const newSelectedOptions = [...selectedOptions, option];
    setSelectedOptions(newSelectedOptions);
    handleSelectedOptionsChanged(newSelectedOptions);
  };

  return (
    <div className="relative w-64">
      {/* Input Field */}
      <input
        type="text"
        value={searchFilter}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setDropdownVisible(true)}
        onBlur={() => setTimeout(() => setDropdownVisible(false), 200)} // Delay for click
        placeholder="Search..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Dropdown Menu */}
      {isDropdownVisible && (
        <ul className="absolute mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg">
          {options.map((option, index) => {
            if (searchFilterPredicate(option) && notSelectedPredicate(option)) {
              return (
                <li
                  key={index}
                  className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                  onMouseDown={() => handleOptionSelect(option)}
                >
                  {getOptionsLabel(option)}
                </li>
              );
            }
            return null;
          })}
        </ul>
      )}
    </div>
  );
};

const GroupView = () => {
  const [createGroupDialogBoxIsOpen, setCreateGroupDialogBoxIsOpen] =
    useState(false);
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const [groupNameProxy, setGroupNameProxy] = useState("");
  const queryClient = useQueryClient();
  const mainDeck = useDeckStore((state) => state.mainDeck);
  const groups = useDeckStore((state) => state.groups);
  const createGroup = useDeckStore((state) => state.createGroup);
  const removeGroup = useDeckStore((state) => state.removeGroup);
  const changeGroupName = useDeckStore((state) => state.changeGroupName);
  const replaceCardsInGroup = useDeckStore(
    (state) => state.replaceCardsInGroup,
  );
  const debouncedGroupNameChange = useDebouncedCallback(
    ({ groupId, value }: { groupId: number; value: string }) => {
      changeGroupName(groupId, value);
    },
    500,
  );
  const handleCreateGroup = () => {
    const newGroupId = createGroup();
    setActiveGroup(newGroupId);
    setCreateGroupDialogBoxIsOpen(true);
  };

  const handleSelectedOptionsChanged = (selectedOptions: CardInfo[]) => {
    if (activeGroup === null) {
      return;
    }
    replaceCardsInGroup(
      activeGroup,
      selectedOptions.map((option) => option.id),
    );
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

  console.log(groups.filter((group) => group.id === activeGroup));

  useEffect(() => {
    if (activeGroup === null) {
      return;
    }
    setGroupNameProxy(
      groups.find((group) => group.id === activeGroup)?.name ?? "",
    );
  }, [activeGroup, groups]);

  const cardInfos = Array.from(mainDeck).map(([cardId, count]) => {
    const cardInfo = retrieveCardInfoInternal(cardId, queryClient);
    return cardInfo;
  });

  return (
    <>
      <DialogBox
        isOpen={createGroupDialogBoxIsOpen}
        onClose={() => {
          setCreateGroupDialogBoxIsOpen(false);
          setActiveGroup(null);
          setGroupNameProxy("");
        }}
      >
        <label> Card Group Name </label>
        <input
          id="textInput"
          type="text"
          value={groupNameProxy}
          onChange={(e) =>
            handleDebounceGroupNameChange(activeGroup, e.target.value)
          }
          placeholder="Type something..."
          className="w-80 rounded-md border border-gray-300 py-2 pl-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <AutoSelect
          options={cardInfos.filter((cardInfo) => !!cardInfo)}
          getOptionsKey={getIdFromCard}
          getOptionsLabel={getNameFromCard}
          handleSelectedOptionsChanged={handleSelectedOptionsChanged}
        />
      </DialogBox>
      <div>
        <h1>Group View</h1>
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
                    Cards:{" "}
                    {group.cardIds
                      .map(
                        (id) =>
                          retrieveCardInfoInternal(id, queryClient)?.name ??
                          "MISSING_CARD",
                      )
                      .join(", ")}
                  </p>
                </div>
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
