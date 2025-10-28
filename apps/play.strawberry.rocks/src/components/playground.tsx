import { CodeEditor } from "./editor/editor";
import { ResizeHandler } from "./resize-handler";
import { StatusBadge } from "./status-badge";
import { usePyodide } from "./strawberry/pyodide";
import { Tabs, Tab } from "./tabs";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Panel, PanelGroup } from "react-resizable-panels";
import { useDebouncedCallback } from "use-debounce";

type Result = {
  error: string | null;
  result: {
    data: any;
    status_code: number;
    headers: { [key: string]: string };
    schema: string;
    jit_source: string | null;
    jit_warning: string | null;
    standard_time_ms: number | null;
    jit_time_ms: number | null;
  } | null;
};

export const Playground = forwardRef(
  (
    {
      defaultCode,
      defaultQuery,
      defaultVariables,
    }: {
      defaultCode: string;
      defaultQuery: string;
      defaultVariables: string;
    },
    ref
  ) => {
    const { executeQuery, initializing } = usePyodide();
    const [editorState, setEditorState] = useState({
      code: defaultCode,
      query: defaultQuery,
      variables: defaultVariables,
    });

    const [useJit, setUseJit] = useState(false);

    const [{ result, error }, setResult] = useState<Result>({
      error: null,
      result: null,
    });

    const runQuery = useDebouncedCallback(async () => {
      const code = editorState.code;
      const query = editorState.query;
      const variables = editorState.variables;

      const { result, error } = await executeQuery({
        schemaCode: code,
        query,
        variables,
        useJit,
      });

      setResult({ result, error });
    }, 100);

    useEffect(() => {
      if (initializing) {
        return;
      }

      runQuery();
    }, [
      editorState.code,
      editorState.query,
      editorState.variables,
      useJit,
      initializing,
    ]);

    useImperativeHandle(ref, () => ({
      getState: () => {
        return editorState;
      },
    }));

    return (
      <PanelGroup direction="horizontal" className="h-full">
        <Panel minSize={20}>
          <Tabs className="h-full">
            <Tab title="Code">
              <CodeEditor
                source={editorState.code}
                onChange={(code) => {
                  setEditorState({ ...editorState, code });
                }}
                language="python"
              />
            </Tab>
          </Tabs>
        </Panel>
        <ResizeHandler />

        <Panel minSize={20}>
          <PanelGroup direction="vertical" className="h-full">
            <Panel minSize={20}>
              <div className="h-full flex flex-col">
                <div className="p-2 border-b dark:bg-dark">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useJit}
                      onChange={(e) => setUseJit(e.target.checked)}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">Use JIT Compiler ⚡</span>
                  </label>
                </div>
                <Tabs className="flex-1">
                  <Tab title="Query">
                    <CodeEditor
                      source={editorState.query}
                      onChange={(query) => {
                        setEditorState({ ...editorState, query });
                      }}
                      language="graphql"
                    />
                  </Tab>
                </Tabs>
              </div>
            </Panel>
            <ResizeHandler direction="vertical" />
            <Panel minSize={20}>
              <Tabs className="h-full">
                <Tab title="Variables">
                  <CodeEditor
                    source={editorState.variables}
                    onChange={(variables) => {
                      setEditorState({ ...editorState, variables });
                    }}
                    language="json"
                  />
                </Tab>
              </Tabs>
            </Panel>
          </PanelGroup>
        </Panel>
        <ResizeHandler />
        <Panel minSize={20}>
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
                    result?.headers
                      ? JSON.stringify(result.headers, null, 2)
                      : ""
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

              {useJit && result?.jit_source && (
                <Tab title="JIT Code ⚡">
                  <CodeEditor
                    source={result.jit_source}
                    language="python"
                    readOnly
                  />
                </Tab>
              )}
            </Tabs>

            <div className="p-2 border-t dark:bg-dark flex items-center gap-4">
              <StatusBadge status={result?.status_code ?? 200} />

              {useJit && result?.jit_warning && (
                <span className="text-xs text-yellow-500">
                  ⚠️ {result.jit_warning}
                </span>
              )}

              {useJit && result?.jit_time_ms && result?.standard_time_ms && (
                <div className="flex items-center gap-2 text-xs">
                  <span>JIT: {result.jit_time_ms.toFixed(2)}ms</span>
                  <span className="text-gray-400">|</span>
                  <span>Standard: {result.standard_time_ms.toFixed(2)}ms</span>
                  <span className="text-green-500 font-semibold">
                    ({(result.standard_time_ms / result.jit_time_ms).toFixed(2)}
                    x faster)
                  </span>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    );
  }
);
