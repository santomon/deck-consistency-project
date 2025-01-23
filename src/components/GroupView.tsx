import { FC, ReactNode, useState } from "react";
import DialogBox from "~/components/Dialogbox";
import { useDeckStore } from "~/store";

const GroupView = () => {
  const [createGroupDialogBoxIsOpen, setCreateGroupDialogBoxIsOpen] =
    useState(false);
  const groups = useDeckStore((state) => state.groups);
  const createGroup = useDeckStore((state) => state.createGroup);

  const handleCreateGroup = () => {
    const newGroupId = createGroup();
    console.log("newGroupId", newGroupId);
  };
  console.log(groups);

  return (
    <>
      <DialogBox
        isOpen={createGroupDialogBoxIsOpen}
        onClose={() => {
          setCreateGroupDialogBoxIsOpen(false);
        }}
      />
      <div>
        <h1>Group View</h1>
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>
    </>
  );
};

export default GroupView;
