import { usePyodide } from "./strawberry/pyodide-context";
import { LoaderCircle } from "lucide-react";

export const StatusIndicator = () => {
  const { initializing, loadingStatus, loading } = usePyodide();

  const busy = initializing || loading;

  return (
    <div
      role="status"
      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
    >
      {busy ? (
        <LoaderCircle className="size-3.5 animate-spin text-strawberry" />
      ) : (
        <span className="size-2 rounded-full bg-emerald-500" />
      )}
      <span className="hidden sm:inline">
        {initializing ? `${loadingStatus}…` : loading ? "Running…" : "Ready"}
      </span>
    </div>
  );
};
