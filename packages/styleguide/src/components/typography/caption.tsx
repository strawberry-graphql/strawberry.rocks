import clsx from "clsx";

export const Caption = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <p className={clsx("typography-caption", className)} style={style}>
      {children}
    </p>
  );
};
