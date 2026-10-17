import { PYODIDE_VERSION } from "./pyodideVersion";

export type RunResult<Result> =
  | { result: Result; error: null }
  | { result: null; error: string };

type WorkerResponse =
  | { ready: true }
  | { id: number; result: unknown; error?: undefined }
  | { id: number; error: string; result?: undefined };

/**
 * Runs Python code in a Pyodide web worker (see public/js/pyodide.worker.js)
 * with the given Strawberry version installed.
 */
export class PyodideWorker extends Worker {
  private currentId = 0;
  private callbacks = new Map<number, (result: RunResult<unknown>) => void>();

  onload: () => void = () => {};

  constructor(strawberryVersion: string) {
    super(`/js/pyodide.worker.js?pyodide=${PYODIDE_VERSION}`, {
      type: "module",
    });

    this.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const data = event.data;

      if ("ready" in data) {
        this.onload();
        return;
      }

      const callback = this.callbacks.get(data.id);

      if (!callback) {
        return;
      }

      this.callbacks.delete(data.id);
      callback(
        data.error === undefined
          ? { result: data.result, error: null }
          : { result: null, error: data.error }
      );
    };

    this.postMessage({ type: "load", version: strawberryVersion });
  }

  terminate() {
    super.terminate();

    for (const callback of this.callbacks.values()) {
      callback({ result: null, error: "Pyodide was restarted" });
    }

    this.callbacks.clear();
  }

  run<Result>(
    python: string,
    globals: Record<string, unknown> = {}
  ): Promise<RunResult<Result>> {
    this.currentId = (this.currentId + 1) % Number.MAX_SAFE_INTEGER;

    const id = this.currentId;

    return new Promise((resolve) => {
      this.callbacks.set(id, resolve as (result: RunResult<unknown>) => void);
      this.postMessage({ type: "run", python, globals, id });
    });
  }
}
