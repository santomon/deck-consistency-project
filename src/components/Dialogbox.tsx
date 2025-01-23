import { FC, ReactNode } from "react";

type DialogBoxProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
};

const DialogBox: FC<DialogBoxProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative h-1/2 w-1/2 rounded-lg bg-white p-6 shadow-lg">
        <button
          className="absolute right-4 top-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default DialogBox;
