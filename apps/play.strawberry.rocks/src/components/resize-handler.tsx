import { clsx } from "clsx";
import { Separator } from "react-resizable-panels";

export const ResizeHandler = ({
  direction = "horizontal",
}: {
  direction?: "horizontal" | "vertical";
}) => {
  return (
    <Separator
      className={clsx("bg-red-200 dark:bg-gray-800", {
        "w-0.5 h-full": direction === "horizontal",
        "h-0.5 w-full": direction === "vertical",
      })}
    />
  );
};
