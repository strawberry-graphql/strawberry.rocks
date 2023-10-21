import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  disabled?: boolean;
  as?: "button" | "a";
  className?: string;
  variant?: "primary" | "circle";
} & (
  | {
      as: "button";
      onClick?: () => void;
      type?: "button" | "submit" | "reset";
    }
  | {
      as: "a";
      href: string;
    }
);
export const Button = ({
  children,
  disabled = false,
  as: Component = "button",
  className,
  variant = "primary",
  ...props
}: Props) => {
  return (
    <Component
      className={clsx(
        "inline-block text-white",
        "typography-label rounded-[30px]",
        {
          "bg-gradient-to-r from-magenta to-orange hover:from-orange hover:to-magenta":
            !disabled,
          "bg-g-50 text-g-400 cursor-not-allowed": disabled,
          "dark:bg-g-900 dark:text-g-700": disabled,
          "px-[20px] py-12 md:px-32 md:py-16": variant === "primary",
          "p-16": variant === "circle",
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
};
