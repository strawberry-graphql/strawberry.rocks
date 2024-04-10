import { CodeEditor } from "./components/editor/editor";
import { usePyodide } from "./components/pyodide";
import { ResizeHandler } from "./components/resize-handler";
import { StatusBadge } from "./components/status-badge";
import { Tabs, Tab } from "./components/tabs";
import { VersionSelector } from "./components/version-selector";
import { useState, useEffect, Suspense } from "react";
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
  data: any;
  status_code: number;
  headers: { [key: string]: string };
};

function App() {
  const { loading, runPython } = usePyodide();
  const [strawberryVersion, setStrawberryVersion] = useState("latest");
  const [editorState, setEditorState] = useState({
    code: STARTER_CODE,
    query: "{ hello }",
    variables: "{}",
  });

  const [result, setResult] = useState<Result | null>(null);

  console.log("strawberryVersion", strawberryVersion);

  const runQuery = async () => {
    const code = editorState.code;
    const query = editorState.query;
    const variables = editorState.variables;

    const { result, error } = await runPython(`
${code}

query = """
${query}
"""

variables = ${variables}

import httpx
import fastapi
from strawberry.fastapi import GraphQLRouter

app = fastapi.FastAPI()

async def context_getter():
    return {}

router = GraphQLRouter(schema, path="/", context_getter=context_getter)

app.include_router(router, prefix="")

async def handle_request():
    async with httpx.AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.post("/", json={"query": query, "variables": variables})

    return response.json(), response.status_code, response.headers.items()

result = await handle_request()

result = {
    "data": result[0],
    "status_code": result[1],
    "headers": dict(result[2]),
}

import js
from pyodide.ffi import to_js

to_js(result, dict_converter=js.Object.fromEntries)
    `);

    setResult(result);
  };

  useEffect(() => {
    console.log("running");
    runQuery();
  }, [editorState.code, editorState.query, editorState.variables]);

  return (
    <>
      {loading && (
        <div className="absolute flex items-center justify-center bg-yellow-200 bg-opacity-90 z-50 px-10 py-6 bottom-10 right-10">
          Loading pyodide...
        </div>
      )}
      <header className="border-b relative z-20 py-3 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6 flex items-center space-x-4">
        <div className="font-bold text-xl">Strawberry Playground</div>
      </header>

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
                <CodeEditor
                  source={
                    result?.data ? JSON.stringify(result.data, null, 2) : ""
                  }
                  language="json"
                  readOnly
                />
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
            </Tabs>

            <div className="p-2 border-t">
              <StatusBadge status={result?.status_code ?? 200} />
            </div>
          </div>
        </Panel>
      </PanelGroup>
      <div className="border-t py-2 px-1">
        <Suspense fallback={<div>Loading...</div>}>
          <VersionSelector
            name="strawberry-graphql"
            onVersionSelected={setStrawberryVersion}
          />
        </Suspense>
      </div>
    </>
  );
}

export default App;
