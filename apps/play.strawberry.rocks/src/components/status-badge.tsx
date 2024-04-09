import { clsx } from "clsx";

export const StatusBadge = ({ status }: { status: number }) => {
  return (
    <span
      className={clsx(`px-2 py-1 text-xs font-semibold rounded`, {
        "bg-green-100 text-green-800": status === 200,
        "bg-red-100 text-red-800": status !== 200,
      })}
    >
      Status: {status}
    </span>
  );
};
