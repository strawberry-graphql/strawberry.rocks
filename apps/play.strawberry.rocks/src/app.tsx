import { CodeEditor } from "./components/editor/editor";

function App() {
  return (
    <>
      <header className="border-b relative z-20 py-3 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6 flex items-center space-x-4">
        Hello
      </header>

      <div className="divide-y divide-x flex">
        <div className="h-screen w-1/3">
          <CodeEditor
            source="print('hello world')"
            onChange={() => { }}
            language="python"
          />
        </div>
        <div className="h-screen w-1/3">
          <CodeEditor
            source="{ hello }"
            onChange={() => { }}
            language="graphql"
          />
        </div>
        <div className="h-screen w-1/3">
          <div>
            <div>Query result</div>
            <div>Schema</div>
          </div>
          <CodeEditor
            source={`{
  "hello": "world"
}`}
            language="json"
            readOnly
          />
        </div>
      </div>
    </>
  );
}

export default App;
