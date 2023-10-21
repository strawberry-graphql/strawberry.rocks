import clsx from "clsx";

export const Code = ({ children }: { children: React.ReactNode }) => {
  return (
    <code
      className={clsx(
        "typography-code rounded-[4px] px-[6px] py-2 ",
        "text-strawberry bg-inline-code border border-strawberry"
      )}
    >
      {children}
    </code>
  );
};
