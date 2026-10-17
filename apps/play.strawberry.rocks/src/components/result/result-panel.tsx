import { CodeEditor } from "../editor/editor";
import { StatusBadge } from "../status-badge";
import type { ExecutionResult } from "../strawberry/pyodide-context";
import { Tab, Tabs } from "../tabs";
import { ConsoleView } from "./console-view";
import { GraphQLErrors } from "./graphql-errors";
import { consoleLogs } from "./logs";
import { PythonErrorView } from "./python-error";

const Count = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="ml-1.5 rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
      {count}
    </span>
  ) : null;

export const ResultPanel = ({
  result,
  error,
  onJumpToCode,
  onJumpToQuery,
}: {
  result: ExecutionResult | null;
  /** Set when the playground itself failed, e.g. Pyodide didn't load */
  error: string | null;
  onJumpToCode: (line: number) => void;
  onJumpToQuery: (line: number, column: number) => void;
}) => {
  const response = result?.response;
  const errors = response?.errors ?? [];
  const logs = result?.logs ?? [];
  const consoleCount =
    consoleLogs(logs).length + (result?.stdout?.trim() ? 1 : 0);

  return (
    <div className="flex h-full flex-col">
      <Tabs className="flex-1">
        <Tab title="Response">
          {error ? (
            <pre className="h-full overflow-auto p-4 font-mono text-xs text-red-600 dark:text-red-400">
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
          <CodeEditor
            source={result?.schema ?? ""}
            language="graphql"
            readOnly
          />
        </Tab>
      </Tabs>

      <div className="flex items-center gap-3 border-t p-2 text-xs dark:bg-dark">
        {result?.status_code ? (
          <StatusBadge status={result.status_code} />
        ) : result?.error || error ? (
          <StatusBadge status={null} />
        ) : null}
        {errors.length > 0 ? (
          <span className="text-red-600 dark:text-red-400">
            {errors.length === 1 ? "1 error" : `${errors.length} errors`}
          </span>
        ) : null}
      </div>
    </div>
  );
};
