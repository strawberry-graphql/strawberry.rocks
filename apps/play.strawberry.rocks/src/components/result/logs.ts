import type { LogEntry } from "../strawberry/pyodide-context";

/** Logs other than the execution errors already shown with the response */
export const consoleLogs = (logs: LogEntry[]) =>
  logs.filter((log) => !log.graphql_message);
