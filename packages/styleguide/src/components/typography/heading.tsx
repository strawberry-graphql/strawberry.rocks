import clsx from "clsx";

export const Heading = ({
  children,
  className,
  level = 1,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4;
  id?: string;
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      {...props}
      className={clsx(
        "[&>a]:no-underline [&>a]:text-inherit",
        {
          "typography-heading-1": level === 1,
          "typography-heading-2": level === 2,
          "typography-heading-3": level === 3,
          "typography-heading-4": level === 4,
        },
        className
      )}
    >
      {children}
    </Tag>
  );
};
