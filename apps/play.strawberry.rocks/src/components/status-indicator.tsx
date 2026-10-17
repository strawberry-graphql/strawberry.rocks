import { usePyodide } from "./strawberry/pyodide-context";
import { LoaderCircle } from "lucide-react";

/** Whether Python is loading, running the code, or ready */
export const StatusIndicator = () => {
  const { initializing, loadingStatus, loading } = usePyodide();

  return (
    <span role="status" className="flex items-center gap-1.5">
      {initializing || loading ? (
        <LoaderCircle className="size-3 animate-spin text-strawberry" />
      ) : (
        <span className="size-1.5 rounded-full bg-emerald-500" />
      )}
      {initializing ? `${loadingStatus}…` : loading ? "Running…" : "Ready"}
    </span>
  );
};
