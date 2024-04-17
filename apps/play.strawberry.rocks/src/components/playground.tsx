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
              <Tabs className="h-full">
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
            </Tabs>

            <div className="p-2 border-t">
              <StatusBadge status={result?.status_code ?? 200} />
            </div>
          </div>
        </Panel>
      </PanelGroup>
    );
  }
);
