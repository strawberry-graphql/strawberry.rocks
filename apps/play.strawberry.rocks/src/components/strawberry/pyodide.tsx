import execute from "./execute.py?raw";
import { useContext, createContext, useState, useCallback } from "react";

const PyodideContext = createContext({
  loading: false,
  error: null,
  initializing: true,
  setLoading: (_loading: boolean) => {},
  setLibraryVersion: ({
    name,
    version,
  }: {
    name: string;
    version: string;
  }) => {},
});

export default class PyodideWorker extends Worker {
  currentId: number;
  callbacks: { [key: number]: (value: any) => void };
  onload: () => void = () => {};

  constructor() {
    super("/js/pyodide.worker.js");

    this.currentId = 0;
    this.callbacks = {};

    this.onmessage = (event) => {
      if (event.data.ready) {
        this.onload();
      }

      const { id, result, error } = event.data;

      if (id in this.callbacks) {
        this.callbacks[id]({ result, error });
        delete this.callbacks[id];
      }
    };
  }

  // run the code in the worker
  runPython(code: string) {
    this.currentId = (this.currentId + 1) % Number.MAX_SAFE_INTEGER;
    return new Promise((onSuccess) => {
      this.callbacks[this.currentId] = onSuccess;
      this.postMessage({
        python: code,
        id: this.currentId,
      });
    });
  }
}

const pyodideWorker = new PyodideWorker();

export const PyodideProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  pyodideWorker.onload = () => {
    setInitializing(false);
  };

  return (
    <PyodideContext.Provider
      value={{ loading, error: null, setLoading, initializing }}
    >
      {children}
    </PyodideContext.Provider>
  );
};

export const usePyodide = () => {
  const { loading, error, setLoading, initializing } =
    useContext(PyodideContext);

  const runPython = useCallback(
    async <Result,>(code: string) => {
      setLoading(true);

      const data = (await pyodideWorker.runPython(code)) as Promise<{
        result: Result;
        error: any;
      }>;

      setLoading(false);

      return data;
    },
    [pyodideWorker]
  );

  const executeQuery = useCallback(
    async ({
      schemaCode,
      query,
      variables,
    }: {
      schemaCode: string;
      query: string;
      variables: string;
    }) => {
      const queryCode = `query = """${query}"""`;
      const variablesCode = `variables = ${variables}`;

      const code = execute
        .replace("# {{ schema }}", schemaCode)
        .replace("# {{ query }}", queryCode)
        .replace("# {{ variables }}", variablesCode);

      const { result, error } = await runPython<{
        data: any;
        status_code: number;
        headers: { [key: string]: string };
      }>(code);

      return { result, error };
    },
    [runPython]
  );

  const setLibraryVersion = useCallback(
    async ({ name, version }: { name: string; version: string }) => {
      const { error } = await runPython(
        `
          import micropip
          micropip.uninstall(["${name}"])
          await micropip.install(["${name}==${version}"])
          print(micropip.list())
        `
      );

      if (error) {
        throw new Error(error);
      }
    },
    [runPython]
  );

  return {
    loading,
    error,
    runPython,
    initializing,
    executeQuery,
    setLibraryVersion,
  };
};