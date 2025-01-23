import { FC, ReactNode, useState } from "react";
import DialogBox from "~/components/Dialogbox";

const GroupView = () => {
  const [createGroupDialogBoxIsOpen, setCreateGroupDialogBoxIsOpen] =
    useState(false);
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
      </div>
    </>
  );
};

export default GroupView;
