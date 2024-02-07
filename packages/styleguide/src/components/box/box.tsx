import clsx from "clsx";

export const Box = ({
  children,
  px,
  textAlign,
  maxWidth,
}: {
  children: React.ReactNode;
  px?: 16;
  textAlign?: "center" | "left";
  maxWidth?: "screen-sm" | "screen-lg";
}) => {
  return (
    <div
      className={clsx({
        "p-16": px === 16,
        "text-center": textAlign === "center",
        "text-left": textAlign === "left",
        "max-w-screen-sm mx-auto": maxWidth === "screen-sm",
        "max-w-screen-lg mx-auto": maxWidth === "screen-lg",
      })}
    >
      {children}
    </div>
  );
};
