import type { EditorState } from "../editor-state";
import { CodeEditor } from "./editor/editor";
import { ResizeHandler } from "./resize-handler";
import { StatusBadge } from "./status-badge";
import { usePyodide } from "./strawberry/pyodide-context";
import type { ExecutionResult } from "./strawberry/pyodide-context";
import { Tabs, Tab } from "./tabs";
import { useEffect, useRef, useState } from "react";
import { Group, Panel } from "react-resizable-panels";
import { useDebouncedCallback } from "use-debounce";

export const Playground = ({
  state,
  onChange,
}: {
  state: EditorState;
  onChange: (state: EditorState) => void;
}) => {
  const { executeQuery, initializing } = usePyodide();
  const [{ result, error }, setResult] = useState<{
    result: ExecutionResult | null;
    error: string | null;
  }>({ result: null, error: null });
  const latestRun = useRef(0);

  const runQuery = useDebouncedCallback(async (state: EditorState) => {
    const run = ++latestRun.current;

    const result = await executeQuery({
      schemaCode: state.code,
      query: state.query,
      variables: state.variables,
    });

    // Ignore results of runs that were superseded while executing
    if (run === latestRun.current) {
      setResult(result);
    }
  }, 100);

  useEffect(() => {
    if (!initializing) {
      runQuery(state);
    }
  }, [state, initializing, runQuery]);

  return (
    <Group orientation="horizontal" className="h-full">
      <Panel minSize="20%">
        <Tabs className="h-full">
          <Tab title="Code">
            <CodeEditor
              source={state.code}
              onChange={(code) => {
                onChange({ ...state, code });
              }}
              language="python"
            />
          </Tab>
        </Tabs>
      </Panel>
      <ResizeHandler />

      <Panel minSize="20%">
        <Group orientation="vertical" className="h-full">
          <Panel minSize="20%">
            <Tabs className="h-full">
              <Tab title="Query">
                <CodeEditor
                  source={state.query}
                  onChange={(query) => {
                    onChange({ ...state, query });
                  }}
                  language="graphql"
                />
              </Tab>
            </Tabs>
          </Panel>
          <ResizeHandler direction="vertical" />
          <Panel minSize="20%">
            <Tabs className="h-full">
              <Tab title="Variables">
                <CodeEditor
                  source={state.variables}
                  onChange={(variables) => {
                    onChange({ ...state, variables });
                  }}
                  language="json"
                />
              </Tab>
            </Tabs>
          </Panel>
        </Group>
      </Panel>
      <ResizeHandler />
      <Panel minSize="20%">
        <div className="h-full flex flex-col">
          <Tabs className="flex-1 w-full h-full">
            <Tab title="Result">
              {error ? (
                <pre className="p-2 text-red-500 overflow-auto text-[14px] h-full">
                  {error}
                </pre>
              ) : (
                <CodeEditor
                  source={
                    result?.data ? JSON.stringify(result.data, null, 2) : ""
                  }
                  language="json"
                  readOnly
                />
              )}
            </Tab>
            <Tab title="Headers">
              <CodeEditor
                source={
                  result?.headers ? JSON.stringify(result.headers, null, 2) : ""
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

          <div className="p-2 border-t dark:bg-dark">
            <StatusBadge status={result?.status_code ?? 200} />
          </div>
        </div>
      </Panel>
    </Group>
  );
};
