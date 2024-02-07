import clsx from "clsx";

export const Label = ({
  children,
  variant = "regular",
  className,
}: {
  children: React.ReactNode;
  variant?: "regular" | "small";
  className?: string;
}) => {
  return (
    <span
      className={clsx(
        {
          "typography-label-2": variant === "small",
          "typography-label": variant === "regular",
        },
        className
      )}
    >
      {children}
    </span>
  );
};
