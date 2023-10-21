import clsx from "clsx";

export const Paragraph = ({
  children,
  variant = "regular",
  bold = false,
  className,
  as = "p",
  ...props
}: {
  children: React.ReactNode;
  variant?: "small" | "regular";
  as?: "p" | "a";
  bold?: boolean;
  className?: string;
}) => {
  const Component = as;

  return (
    <Component
      className={clsx(
        {
          "typography-paragraph": variant === "regular",
          "typography-paragraph-2": variant === "small",
          "font-bold": bold,
        },
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
