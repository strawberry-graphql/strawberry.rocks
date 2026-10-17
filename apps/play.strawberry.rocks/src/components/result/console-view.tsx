import type { LogEntry } from "../strawberry/pyodide-context";
import { PythonErrorView } from "./python-error";
import clsx from "clsx";

export const ConsoleView = ({
  stdout,
  logs,
  onJumpToCode,
}: {
  stdout: string;
  logs: LogEntry[];
  onJumpToCode: (line: number) => void;
}) => {
  if (!stdout && logs.length === 0) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        Output from <code className="font-mono">print()</code> and log messages
        shows up here.
      </p>
    );
  }

  return (
    <div className="h-full overflow-auto">
      {stdout ? (
        <pre className="border-b px-4 py-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {stdout}
        </pre>
      ) : null}
      <ul className="divide-y">
        {logs.map((log, index) => (
          <li key={index} className="space-y-2 px-4 py-3">
            <p className="font-mono text-xs">
              <span
                className={clsx("mr-2 font-semibold", {
                  "text-red-600 dark:text-red-400":
                    log.level === "ERROR" || log.level === "CRITICAL",
                  "text-amber-600 dark:text-amber-400": log.level === "WARNING",
                  "text-muted-foreground":
                    log.level === "INFO" || log.level === "DEBUG",
                })}
              >
                {log.level}
              </span>
              <span className="mr-2 text-muted-foreground">{log.logger}</span>
              {log.message}
            </p>
            {log.error ? (
              <PythonErrorView error={log.error} onJumpToCode={onJumpToCode} />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};
