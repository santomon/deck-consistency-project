import { ReactNode } from "react";

interface ContentCardProps {
  title: string;
  editCallback?: () => void;
  deleteCallback?: () => void;
  children: ReactNode;
  className?: string;
}

const ContentCard = ({
  title,
  className = "",
  editCallback,
  deleteCallback,
  children,
}: ContentCardProps) => {
  return (
    <div
      className={
        "flex min-w-72 flex-col items-stretch justify-between gap-5 rounded-md border border-gray-300 bg-teal-600 hover:bg-teal-700 " +
        className
      }
    >
      <div
        className={"flex flex-row items-center justify-start pl-4 pr-4 pt-4"}
      >
        <h4 className={"text-2xl font-semibold"}>{title}</h4>
      </div>
      <div className={"pl-4 pr-4"}>{children}</div>
      <div className={"flex items-center justify-end gap-2 px-2 py-2"}>
        {editCallback && (
          <button
            className={
              "rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            }
            onClick={editCallback}
          >
            Edit
          </button>
        )}
        {deleteCallback && (
          <button
            className={
              "rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
            }
            onClick={deleteCallback}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
