import clsx from "clsx";

export const Spacer = ({ size }: { size: 12 | 16 | 24 | 40 | 80 | 128 }) => {
  return (
    <div
      className={clsx({
        "h-12": size === 12,
        "h-16": size === 16,
        "h-24": size === 24,
        "h-40": size === 40,
        "h-80": size === 80,
        "h-[128px]": size === 128,
      })}
    />
  );
};
