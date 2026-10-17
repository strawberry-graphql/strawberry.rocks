import { clsx } from "clsx";
import { Separator } from "react-resizable-panels";

export const ResizeHandler = ({
  direction = "horizontal",
}: {
  direction?: "horizontal" | "vertical";
}) => {
  return (
    <Separator
      className={clsx(
        "bg-border transition-colors data-[separator=active]:bg-strawberry data-[separator=hover]:bg-strawberry/60",
        {
          "w-px": direction === "horizontal",
          "h-px": direction === "vertical",
        }
      )}
    />
  );
};
