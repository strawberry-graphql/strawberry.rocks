import { Playground } from "./components/playground";
import { usePyodide } from "./components/strawberry/pyodide";
import { VersionSelector } from "./components/version-selector";
import { Suspense } from "react";

function App() {
  const { initializing, setLibraryVersion } = usePyodide();

  return (
    <>
      {initializing && (
        <div className="absolute flex items-center justify-center bg-yellow-200 bg-opacity-90 z-50 px-10 py-6 bottom-10 right-10">
          Loading pyodide...
        </div>
      )}
      <header className="border-b relative z-20 py-3 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6 flex items-center space-x-4">
        <div className="font-bold text-xl">Strawberry Playground</div>
      </header>

      <Playground />

      <div className="border-t py-2 px-1">
        <Suspense fallback={<div>Loading...</div>}>
          <VersionSelector
            name="strawberry-graphql"
            onVersionSelected={(version) =>
              setLibraryVersion({ name: "strawberry-graphql", version })
            }
          />
        </Suspense>
      </div>
    </>
  );
}

export default App;
