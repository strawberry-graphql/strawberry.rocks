import { DocResult } from "./types";
import clsx from "clsx";

const Arrow = () => (
  <svg
    width="8"
    height="14"
    viewBox="0 0 8 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 13L7 7L1 1"
      className="stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Result = ({
  result,
  selected,
  active,
}: {
  result: DocResult;
  selected: boolean;
  active: boolean;
}) => {
  return (
    <div
      className={clsx(
        "rounded-[8px] px-16 py-12 typography-paragraph-2 text-g-900",
        "flex items-center justify-between",
        {
          "bg-g-50 dark:bg-g-900 text-g-900 dark:text-g-50": !(
            active || selected
          ),
          "bg-strawberry text-white selected": active || selected,
        }
      )}
    >
      <span>{result.name}</span>
      <Arrow />
    </div>
  );
};
