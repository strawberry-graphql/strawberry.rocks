import { CodeEditor } from "../editor/editor";
import { SchemaView } from "../schema/schema-view";
import { StatusBadge } from "../status-badge";
import {
  usePyodide,
  type ExecutionResult,
} from "../strawberry/pyodide-context";
import { Tab, Tabs } from "../tabs";
import { ConsoleView } from "./console-view";
import { GraphQLErrors } from "./graphql-errors";
import { consoleLogs } from "./logs";
import { PythonErrorView } from "./python-error";
import type { GraphQLSchema } from "graphql";
import { LoaderCircle } from "lucide-react";

const Count = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="ml-1.5 rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
      {count}
    </span>
  ) : null;

export const ResultPanel = ({
  result,
  error,
  duration,
  schema,
  sdl,
  onJumpToCode,
  onJumpToQuery,
}: {
  result: ExecutionResult | null;
  /** Set when the playground itself failed, e.g. Pyodide didn't load */
  error: string | null;
  duration: number | null;
  schema: GraphQLSchema | null;
  sdl: string | null;
  onJumpToCode: (line: number) => void;
  onJumpToQuery: (line: number, column: number) => void;
}) => {
  const { initializing, loadingStatus } = usePyodide();
  const response = result?.response;
  const errors = response?.errors ?? [];
  const logs = result?.logs ?? [];
  const consoleCount =
    consoleLogs(logs).length + (result?.stdout?.trim() ? 1 : 0);

  return (
    <div className="flex h-full flex-col">
      <Tabs className="flex-1">
        <Tab title="Response">
          {!result && !error ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <LoaderCircle className="size-5 animate-spin text-strawberry" />
              <div>
                <p className="text-sm font-medium">
                  {initializing
                    ? "Setting up Python in your browser"
                    : "Running your query"}
                </p>
                <p className="mt-1 max-w-64 text-xs text-muted-foreground">
                  {initializing
                    ? `${loadingStatus}… The first load downloads Pyodide and takes a few seconds.`
                    : "Results show up here."}
                </p>
              </div>
            </div>
          ) : error ? (
            <pre className="h-full overflow-auto p-4 font-mono text-xs text-destructive">
              {error}
            </pre>
          ) : result?.error ? (
            <div className="h-full overflow-auto p-4">
              <PythonErrorView
                error={result.error}
                onJumpToCode={onJumpToCode}
              />
            </div>
          ) : (
            <div className="flex h-full flex-col">
              <div className="min-h-0 flex-1">
                <CodeEditor
                  source={response ? JSON.stringify(response, null, 2) : ""}
                  language="json"
                  readOnly
                />
              </div>
              {errors.length > 0 ? (
                <div className="max-h-[50%] shrink-0 overflow-auto border-t">
                  <GraphQLErrors
                    errors={errors}
                    logs={logs}
                    onJumpToCode={onJumpToCode}
                    onJumpToQuery={onJumpToQuery}
                  />
                </div>
              ) : null}
            </div>
          )}
        </Tab>
        <Tab
          title={
            <>
              Console
              <Count count={consoleCount} />
            </>
          }
        >
          <ConsoleView
            stdout={result?.stdout ?? ""}
            logs={consoleLogs(logs)}
            onJumpToCode={onJumpToCode}
          />
        </Tab>
        <Tab title="Headers">
          <CodeEditor
            source={
              result?.status_code ? JSON.stringify(result.headers, null, 2) : ""
            }
            language="json"
            readOnly
          />
        </Tab>
        <Tab title="Schema">
          <SchemaView schema={schema} sdl={sdl} />
        </Tab>
      </Tabs>

      <div className="flex h-9 shrink-0 items-center gap-3 border-t bg-chrome px-4 text-xs text-muted-foreground">
        {result?.status_code ? (
          <StatusBadge status={result.status_code} />
        ) : result?.error || error ? (
          <StatusBadge status={null} />
        ) : null}
        {errors.length > 0 ? (
          <span className="font-medium text-destructive">
            {errors.length === 1 ? "1 error" : `${errors.length} errors`}
          </span>
        ) : null}
        {duration !== null && (result || error) ? (
          <span className="ml-auto tabular-nums">
            {duration < 1000
              ? `${Math.round(duration)} ms`
              : `${(duration / 1000).toFixed(1)} s`}
          </span>
        ) : null}
      </div>
    </div>
  );
};
