import execute from "./execute.py?raw";
import type { RunResult } from "./pyodide-worker";
import { createContext, useCallback, useContext } from "react";

// Python's None arrives as undefined, so nullable fields are also optional

/**
 * Details of Strawberry's own exceptions (e.g. a missing annotation), see
 * `strawberry_exception_details` in execute.py
 */
export type StrawberryExceptionDetails = {
  title: string;
  annotation?: string | null;
  suggestion?: string | null;
  documentation_url?: string | null;
  location?: { line: number; column: number; end_column: number } | null;
  /** The lines around the location */
  snippet: { line: number; text: string }[];
};

/** An exception raised by the user's code, see `format_exception` in execute.py */
export type PythonError = {
  type: string;
  message: string;
  traceback?: string | null;
  line?: number | null;
  strawberry?: StrawberryExceptionDetails | null;
};

export type LogEntry = {
  level: string;
  logger: string;
  message: string;
  error?: PythonError | null;
  /** Set for errors logged by Strawberry while executing the query */
  graphql_message?: string | null;
  path?: (string | number)[] | null;
};

export type GraphQLError = {
  message: string;
  locations?: { line: number; column: number }[];
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
};

export type GraphQLResponse = {
  data?: unknown;
  errors?: GraphQLError[];
  extensions?: Record<string, unknown>;
};

export type ExecutionResult = {
  /** Not set when the schema code (or the variables) failed */
  response?: GraphQLResponse | null;
  status_code?: number | null;
  headers: Record<string, string>;
  schema?: string | null;
  error?: PythonError | null;
  stdout: string;
  logs: LogEntry[];
};

type PyodideContextValue = {
  initializing: boolean;
  /** What's happening while initializing, e.g. "Installing Strawberry" */
  loadingStatus: string;
  loading: boolean;
  run: <Result>(
    python: string,
    globals?: Record<string, unknown>
  ) => Promise<RunResult<Result>>;
};

export const PyodideContext = createContext<PyodideContextValue | null>(null);

export const usePyodide = () => {
  const context = useContext(PyodideContext);

  if (!context) {
    throw new Error("usePyodide must be used within a PyodideProvider");
  }

  const { initializing, loadingStatus, loading, run } = context;

  const executeQuery = useCallback(
    ({
      schemaCode,
      query,
      variables,
    }: {
      schemaCode: string;
      query: string;
      variables: string;
    }) =>
      run<ExecutionResult>(execute, {
        schema_code: schemaCode,
        query,
        variables,
      }),
    [run]
  );

  return { initializing, loadingStatus, loading, executeQuery };
};
