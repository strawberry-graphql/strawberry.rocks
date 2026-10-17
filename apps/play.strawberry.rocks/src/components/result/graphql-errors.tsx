import type {
  GraphQLError,
  LogEntry,
  PythonError,
} from "../strawberry/pyodide-context";
import { LineLink, PythonErrorView } from "./python-error";

const samePath = (
  a: (string | number)[] | null | undefined,
  b: (string | number)[] | null | undefined
) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/** Finds the exception Strawberry logged for a GraphQL error, if any */
const findErrorCause = (
  error: GraphQLError,
  logs: LogEntry[]
): PythonError | null =>
  logs.find(
    (log) =>
      log.error &&
      log.graphql_message === error.message &&
      samePath(log.path, error.path)
  )?.error ?? null;

export const GraphQLErrors = ({
  errors,
  logs,
  onJumpToCode,
  onJumpToQuery,
}: {
  errors: GraphQLError[];
  logs: LogEntry[];
  onJumpToCode: (line: number) => void;
  onJumpToQuery: (line: number, column: number) => void;
}) => (
  <ul className="divide-y">
    {errors.map((error, index) => {
      const cause = findErrorCause(error, logs);

      return (
        <li key={index} className="space-y-2 px-4 py-3">
          <p className="text-sm font-medium text-destructive">
            {error.message}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {error.path ? (
              <span>
                Path{" "}
                <code className="font-mono text-foreground">
                  {error.path.join(".")}
                </code>
              </span>
            ) : null}
            {error.locations?.map((location) => (
              <span key={`${location.line}:${location.column}`}>
                Query{" "}
                <LineLink
                  label={`${location.line}:${location.column}`}
                  onClick={() => onJumpToQuery(location.line, location.column)}
                />
              </span>
            ))}
          </div>
          {cause ? (
            <PythonErrorView error={cause} onJumpToCode={onJumpToCode} />
          ) : null}
        </li>
      );
    })}
  </ul>
);
