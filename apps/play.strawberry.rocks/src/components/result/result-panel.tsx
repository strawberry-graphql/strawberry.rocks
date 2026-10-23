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
import { consoleCount, consoleLogs } from "./logs";
import { PythonErrorView } from "./python-error";
import type { GraphQLSchema } from "graphql";
import { LoaderCircle } from "lucide-react";

export type ResultProps = {
  result: ExecutionResult | null;
  /** Set when the playground itself failed, e.g. Pyodide didn't load */
  error: string | null;
  /** How long the last run took, in milliseconds */
  duration: number | null;
  schema: GraphQLSchema | null;
  sdl: string | null;
  onJumpToCode: (line: number) => void;
  onJumpToQuery: (line: number, column: number) => void;
};

export const Count = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="ml-1.5 rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
      {count}
    </span>
  ) : null;

export const ResponseView = ({
  result,
  error,
  onJumpToCode,
  onJumpToQuery,
}: Pick<
  ResultProps,
  "result" | "error" | "onJumpToCode" | "onJumpToQuery"
>) => {
  const { initializing, loadingStatus } = usePyodide();
  const response = result?.response;
  const errors = response?.errors ?? [];

  if (!result && !error) {
    return (
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
    );
  }

  if (error) {
    return (
      <pre className="h-full overflow-auto p-4 font-mono text-xs text-destructive">
        {error}
      </pre>
    );
  }

  if (result?.error) {
    return (
      <div className="h-full overflow-auto p-4">
        <PythonErrorView error={result.error} onJumpToCode={onJumpToCode} />
      </div>
    );
  }

  return (
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
            logs={result?.logs ?? []}
            onJumpToCode={onJumpToCode}
            onJumpToQuery={onJumpToQuery}
          />
        </div>
      ) : null}
    </div>
  );
};

export const ResultConsole = ({
  result,
  onJumpToCode,
}: Pick<ResultProps, "result" | "onJumpToCode">) => (
  <ConsoleView
    stdout={result?.stdout ?? ""}
    logs={consoleLogs(result?.logs ?? [])}
    onJumpToCode={onJumpToCode}
  />
);

export const ResultHeaders = ({ result }: Pick<ResultProps, "result">) => (
  <CodeEditor
    source={result?.status_code ? JSON.stringify(result.headers, null, 2) : ""}
    language="json"
    readOnly
  />
);

/** Status code, error count and duration of the last run */
export const ResultStatus = ({
  result,
  error,
  duration,
}: Pick<ResultProps, "result" | "error" | "duration">) => {
  const errors = result?.response?.errors ?? [];

  return (
    <div className="flex items-center gap-3 whitespace-nowrap text-xs text-muted-foreground">
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
        <span className="tabular-nums">
          {duration < 1000
            ? `${Math.round(duration)} ms`
            : `${(duration / 1000).toFixed(1)} s`}
        </span>
      ) : null}
    </div>
  );
};

/** All results in one panel, for small screens */
export const ResultPanel = (props: ResultProps) => (
  <div className="flex h-full flex-col">
    <Tabs className="flex-1">
      <Tab title="Response">
        <ResponseView {...props} />
      </Tab>
      <Tab
        title={
          <>
            Console
            <Count count={consoleCount(props.result)} />
          </>
        }
      >
        <ResultConsole {...props} />
      </Tab>
      <Tab title="Response headers">
        <ResultHeaders {...props} />
      </Tab>
      <Tab title="Schema">
        <SchemaView schema={props.schema} sdl={props.sdl} />
      </Tab>
    </Tabs>

    <div className="flex h-9 shrink-0 items-center border-t bg-chrome px-4">
      <ResultStatus {...props} />
    </div>
  </div>
);
