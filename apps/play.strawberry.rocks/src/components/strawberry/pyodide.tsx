import execute from "./execute.py?raw";
import {
  useContext,
  useRef,
  useEffect,
  createContext,
  useState,
  useCallback,
} from "react";

const PyodideContext = createContext({
  loading: false,
  error: null,
  initializing: true,
  pyodideWorker: null as PyodideWorker | null,
  setLoading: (_loading: boolean) => {},
  setLibraryVersion: (_version: { name: string; version: string }) => {},
});

export default class PyodideWorker extends Worker {
  currentId: number;
  callbacks: { [key: number]: (value: any) => void };
  onload: () => void = () => {};

  constructor(version: string) {
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

    this.postMessage({
      type: "load",
      version,
    });
  }

  // run the code in the worker
  runPython(code: string) {
    this.currentId = (this.currentId + 1) % Number.MAX_SAFE_INTEGER;
    return new Promise((onSuccess) => {
      this.callbacks[this.currentId] = onSuccess;
      this.postMessage({
        type: "run",
        python: code,
        id: this.currentId,
      });
    });
  }
}

export const PyodideProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const workerRef = useRef<PyodideWorker | null>(null);
  const previousVersion = useRef<string | null>(null);
  const [pyodideWorker, setPyodideWorker] = useState<PyodideWorker | null>(
    null
  );
  const [strawberryVersion, setStrawberryVersion] = useState("latest");

  useEffect(() => {
    if (workerRef.current && previousVersion.current === strawberryVersion) {
      return;
    }

    setInitializing(true);

    console.log("creating a new worker");

    const worker = new PyodideWorker(strawberryVersion);

    worker.onload = () => {
      console.log("worker ready");
      setInitializing(false);

      setPyodideWorker(worker);
    };

    workerRef.current = worker;
    previousVersion.current = strawberryVersion;
  }, [strawberryVersion]);

  const setLibraryVersion = ({
    name,
    version,
  }: {
    name: string;
    version: string;
  }) => {
    if (name !== "strawberry-graphql") {
      throw new Error(`Unknown library: ${name}`);
    }

    console.log("setting strawberry version", version);

    setStrawberryVersion(version);
  };

  return (
    <PyodideContext.Provider
      value={{
        loading,
        error: null,
        setLoading,
        initializing,
        pyodideWorker,
        setLibraryVersion,
      }}
    >
      {children}
    </PyodideContext.Provider>
  );
};

export const usePyodide = () => {
  const {
    loading,
    error,
    setLoading,
    initializing,
    pyodideWorker,
    setLibraryVersion,
  } = useContext(PyodideContext);

  const runPython = useCallback(
    async <Result,>(code: string) => {
      if (!pyodideWorker) {
        return { result: null, error: "Pyodide not initialized" };
      }

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

  return {
    loading,
    error,
    runPython,
    initializing,
    executeQuery,
    setLibraryVersion,
  };
};
