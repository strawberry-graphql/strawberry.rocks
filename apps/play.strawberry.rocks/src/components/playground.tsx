import { CodeEditor } from "./editor/editor";
import { ResizeHandler } from "./resize-handler";
import { StatusBadge } from "./status-badge";
import { usePyodide } from "./strawberry/pyodide";
import { Tabs, Tab } from "./tabs";
import { useState, useEffect, useCallback } from "react";
import { Panel, PanelGroup } from "react-resizable-panels";

const STARTER_CODE = `
import strawberry

@strawberry.type
class Query:
    @strawberry.field
    def hello(self, info: strawberry.Info) -> str:
        return "world"

schema = strawberry.Schema(Query)
`.trim();

type Result = {
  error: string | null;
  result: {
    data: any;
    status_code: number;
    headers: { [key: string]: string };
  } | null;
};

export const Playground = () => {
  const { executeQuery } = usePyodide();
  const [editorState, setEditorState] = useState({
    code: STARTER_CODE,
    query: "{ hello }",
    variables: "{}",
  });

  const [{ result, error }, setResult] = useState<Result>({
    error: null,
    result: null,
  });

  const runQuery = useCallback(async () => {
    const code = editorState.code;
    const query = editorState.query;
    const variables = editorState.variables;

    const { result, error } = await executeQuery({
      schemaCode: code,
      query,
      variables,
    });

    setResult({ result, error });
  }, [editorState]);

  useEffect(() => {
    console.log("running");
    runQuery();
  }, [editorState.code, editorState.query, editorState.variables]);

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
          <Tabs className="flex-1 w-full">
            <Tab title="Result">
              {error ? (
                <pre className="p-2 text-red-500 overflow-auto h-full text-[14px]">
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
          </Tabs>

          <div className="p-2 border-t">
            <StatusBadge status={result?.status_code ?? 200} />
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
};