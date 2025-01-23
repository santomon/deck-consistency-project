import { useRef, useState } from "react";
import DialogBox from "~/components/Dialogbox";
import { useDeckStore } from "~/store";
import { useDebouncedCallback } from "~/components/hooks";

const GroupView = () => {
  const [createGroupDialogBoxIsOpen, setCreateGroupDialogBoxIsOpen] =
    useState(false);
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const [groupNameProxy, setGroupNameProxy] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const groups = useDeckStore((state) => state.groups);
  const createGroup = useDeckStore((state) => state.createGroup);
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

  return (
    <>
      <DialogBox
        isOpen={createGroupDialogBoxIsOpen}
        onClose={() => {
          setCreateGroupDialogBoxIsOpen(false);
        }}
      >
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
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>
    </>
  );
};

export default GroupView;
