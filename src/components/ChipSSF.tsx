interface ChipSSFProps {
  label: string;
  onDelete: () => void;
}

export const ChipSSF = ({ label, onDelete }: ChipSSFProps) => {
  return (
    <div className="flex flex-row items-center justify-end rounded-full bg-blue-500 px-3 py-1 text-white">
      {label}
      <button className={"bg-red-500"} onClick={onDelete}>
        x
      </button>
    </div>
  );
};
