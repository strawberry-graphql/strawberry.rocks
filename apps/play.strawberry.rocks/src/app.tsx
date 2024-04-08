import { useState } from "react";
import { CodeEditor } from "./components/editor/editor";
import { usePyodide } from "./components/pyodide";
import { Tabs, Tab } from "./components/tabs";

const STARTER_CODE = `
import strawberry

@strawberry.type
class Query:
    @strawberry.field
    def hello() -> str:
        return "world"

schema = strawberry.Schema(Query)
`.trim();

function App() {
  const { loading, runPython } = usePyodide();

  const [result, setResult] = useState<string | null>(null);

  const runQuery = async (code: string) => {
    const { result, error } = await runPython(`
${code}

result = await schema.execute('{hello, hello2}')

from strawberry.http import process_result

data = process_result(result)


print(data)
import json

import js
from pyodide.ffi import to_js

to_js(data, dict_converter=js.Object.fromEntries)
    `);

    console.log(JSON.stringify(result, null, 4));
    setResult(JSON.stringify(result, null, 4));
  };

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

      <div className="divide-x flex">
        <Tabs className="h-screen w-1/3">
          <Tab title="Code">
            <CodeEditor
              source={STARTER_CODE}
              onChange={runQuery}
              language="python"
            />
          </Tab>
        </Tabs>
        <Tabs className="h-screen w-1/3">
          <Tab title="Query">
            <CodeEditor
              source="{ hello }"
              onChange={() => { }}
              language="graphql"
            />
          </Tab>
          <Tab title="Variables">
            <CodeEditor source="{}" onChange={() => { }} language="json" />
          </Tab>
        </Tabs>

        <Tabs className="h-screen w-1/3">
          <Tab title="Result">
            <CodeEditor source={result ?? ""} language="json" readOnly />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default App;
