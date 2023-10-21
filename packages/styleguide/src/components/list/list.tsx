import clsx from "clsx";

export const ListItem = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <li className={clsx("mb-2", className)} {...props}>
      {children}
    </li>
  );
};

export const List = ({
  variant = "unordered",
  children,
  className,
}: {
  variant?: "unordered" | "ordered";
  children: React.ReactNode;
  className?: string;
}) => {
  const Tag = variant === "unordered" ? "ul" : "ol";

  return (
    <Tag
      className={clsx(
        "list-outside typography-paragraph",
        {
          "list-disc pl-16": variant === "unordered",
          "list-decimal pl-[20px]": variant === "ordered",
        },
        className
      )}
    >
      {children}
    </Tag>
  );
};
