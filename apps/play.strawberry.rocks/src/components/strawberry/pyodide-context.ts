import execute from "./execute.py?raw";
import type { RunResult } from "./pyodide-worker";
import { createContext, useCallback, useContext } from "react";

export type ExecutionResult = {
  data: unknown;
  status_code: number;
  headers: Record<string, string>;
  schema: string;
};

type PyodideContextValue = {
  initializing: boolean;
  loading: boolean;
  run: <Result>(python: string) => Promise<RunResult<Result>>;
};

export const PyodideContext = createContext<PyodideContextValue | null>(null);

export const usePyodide = () => {
  const context = useContext(PyodideContext);

  if (!context) {
    throw new Error("usePyodide must be used within a PyodideProvider");
  }

  const { initializing, loading, run } = context;

  const executeQuery = useCallback(
    ({
      schemaCode,
      query,
      variables,
    }: {
      schemaCode: string;
      query: string;
      variables: string;
    }) => {
      const queryCode = `query = """${query}"""`;
      const variablesCode = variables.trim()
        ? `variables = ${variables.trim()}`
        : `variables = {}`;

      const code = execute
        .replace("# {{ schema }}", schemaCode)
        .replace("# {{ query }}", queryCode)
        .replace("# {{ variables }}", variablesCode);

      return run<ExecutionResult>(code);
    },
    [run]
  );

  return { initializing, loading, executeQuery };
};
