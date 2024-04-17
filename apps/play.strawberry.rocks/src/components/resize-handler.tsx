import { clsx } from "clsx";
import { PanelResizeHandle } from "react-resizable-panels";

export const ResizeHandler = ({
  direction = "horizontal",
}: {
  direction?: "horizontal" | "vertical";
}) => {
  return (
    <div
      className={clsx({
        "bg-red-200": true,
        "w-0.5 h-full": direction === "horizontal",
        "h-0.5 w-full": direction === "vertical",
      })}
    >
      <PanelResizeHandle className="bg-red-200 w-full h-full" />
    </div>
  );
};
