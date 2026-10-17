import type { PythonError } from "../strawberry/pyodide-context";

export const LineLink = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="font-mono text-xs underline decoration-dotted underline-offset-2 hover:text-foreground"
  >
    {label}
  </button>
);

export const PythonErrorView = ({
  error,
  onJumpToCode,
}: {
  error: PythonError;
  onJumpToCode: (line: number) => void;
}) => (
  <div className="space-y-2">
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="font-mono text-sm font-semibold text-red-600 dark:text-red-400">
        {error.type}
      </span>
      {error.line ? (
        <span className="text-muted-foreground">
          <LineLink
            label={`schema.py:${error.line}`}
            onClick={() => onJumpToCode(error.line!)}
          />
        </span>
      ) : null}
    </div>
    {error.traceback ? (
      <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs leading-relaxed">
        {error.traceback}
      </pre>
    ) : (
      <p className="text-sm">{error.message}</p>
    )}
  </div>
);
