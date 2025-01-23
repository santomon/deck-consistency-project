import { useEffect, useRef, useState } from "react";
import DialogBox from "~/components/Dialogbox";
import { useDeckStore } from "~/store";
import { useDebouncedCallback } from "~/components/hooks";

const GroupView = () => {
  const [createGroupDialogBoxIsOpen, setCreateGroupDialogBoxIsOpen] =
    useState(false);
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const [groupNameProxy, setGroupNameProxy] = useState("");
  const mainDeck = useDeckStore((state) => state.mainDeck);
  const groups = useDeckStore((state) => state.groups);
  const createGroup = useDeckStore((state) => state.createGroup);
  const removeGroup = useDeckStore((state) => state.removeGroup);
  const changeGroupName = useDeckStore((state) => state.changeGroupName);
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
                      .map((id) => mainDeck.get(id) ?? "MISSING_CARD")
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
