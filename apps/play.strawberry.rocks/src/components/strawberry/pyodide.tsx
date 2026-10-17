import { PyodideContext } from "./pyodide-context";
import { PyodideWorker } from "./pyodide-worker";
import { LOCAL_STRAWBERRY_VERSION } from "./strawberryVersion";
import { useCallback, useEffect, useRef, useState } from "react";

// Bumped by the dev server whenever the local Strawberry checkout changes,
// see plugins/local-strawberry.ts
const useLocalStrawberryRevision = () => {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const onChange = () => setRevision((revision) => revision + 1);

    import.meta.hot?.on("local-strawberry:changed", onChange);

    return () => import.meta.hot?.off("local-strawberry:changed", onChange);
  }, []);

  return revision;
};

export const PyodideProvider = ({
  strawberryVersion,
  children,
}: {
  strawberryVersion: string;
  children: React.ReactNode;
}) => {
  const workerRef = useRef<PyodideWorker | null>(null);
  const [readyKey, setReadyKey] = useState<string | null>(null);
  const [pendingRuns, setPendingRuns] = useState(0);
  const localRevision = useLocalStrawberryRevision();

  // A new worker is started whenever this changes
  const workerKey =
    strawberryVersion === LOCAL_STRAWBERRY_VERSION
      ? `${strawberryVersion}@${localRevision}`
      : strawberryVersion;

  useEffect(() => {
    const worker = new PyodideWorker(strawberryVersion);

    worker.onload = () => setReadyKey(workerKey);
    workerRef.current = worker;

    return () => worker.terminate();
  }, [strawberryVersion, workerKey]);

  const run = useCallback(
    async <Result,>(python: string, globals?: Record<string, unknown>) => {
      const worker = workerRef.current;

      if (!worker) {
        return { result: null, error: "Pyodide not initialized" } as const;
      }

      setPendingRuns((count) => count + 1);

      try {
        return await worker.run<Result>(python, globals);
      } finally {
        setPendingRuns((count) => count - 1);
      }
    },
    []
  );

  return (
    <PyodideContext.Provider
      value={{
        initializing: readyKey !== workerKey,
        loading: pendingRuns > 0,
        run,
      }}
    >
      {children}
    </PyodideContext.Provider>
  );
};
