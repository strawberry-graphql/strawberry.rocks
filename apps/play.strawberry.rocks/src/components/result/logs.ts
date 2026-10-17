import type { ExecutionResult, LogEntry } from "../strawberry/pyodide-context";

/** Logs other than the execution errors already shown with the response */
export const consoleLogs = (logs: LogEntry[]) =>
  logs.filter((log) => !log.graphql_message);

/** Number of entries shown in the console, for its tab title */
export const consoleCount = (result: ExecutionResult | null) =>
  consoleLogs(result?.logs ?? []).length + (result?.stdout?.trim() ? 1 : 0);
