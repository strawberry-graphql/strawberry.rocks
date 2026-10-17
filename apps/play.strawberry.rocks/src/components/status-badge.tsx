import { clsx } from "clsx";

/** `null` means the code failed before a response was produced */
export const StatusBadge = ({ status }: { status: number | null }) => {
  const ok = status !== null && status < 400;

  return (
    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
      <span
        className={clsx(
          "size-2 rounded-full",
          ok ? "bg-emerald-500" : "bg-destructive"
        )}
      />
      {status === null ? "Error" : status}
    </span>
  );
};
