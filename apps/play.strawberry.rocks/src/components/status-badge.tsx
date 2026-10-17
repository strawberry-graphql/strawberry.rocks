import { clsx } from "clsx";

/** `null` means the code failed before a response was produced */
export const StatusBadge = ({ status }: { status: number | null }) => {
  return (
    <span
      className={clsx(`px-2 py-1 text-xs font-semibold rounded-sm`, {
        "bg-green-100 text-green-800": status === 200,
        "bg-red-100 text-red-800": status !== 200,
      })}
    >
      {status === null ? "Error" : `Status: ${status}`}
    </span>
  );
};
