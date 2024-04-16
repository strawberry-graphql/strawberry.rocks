import { Logo } from "./components/logo";
import { Playground } from "./components/playground";
import { usePyodide } from "./components/strawberry/pyodide";
import { Button } from "./components/ui/button";
import { VersionSelector } from "./components/version-selector";
import { useSnippet } from "./hooks/use-snippet";
import clsx from "clsx";
import { Suspense, useEffect, useState, useRef } from "react";

function App() {
  const { initializing, setLibraryVersion, loading } = usePyodide();
  const { snippet } = useSnippet();
  const previousVersion = useRef<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string>(
    snippet.strawberryVersion
  );

  useEffect(() => {
    if (initializing) {
      return;
    }

    if (previousVersion.current !== currentVersion) {
      setLibraryVersion({
        name: "strawberry-graphql",
        version: currentVersion,
      });

      previousVersion.current = currentVersion;
    }
  }, [initializing, setLibraryVersion, currentVersion]);

  return (
    <>
      {initializing && (
        <div className="absolute flex items-center justify-center bg-yellow-200 bg-opacity-90 z-50 px-10 py-6 bottom-10 right-10">
          Loading pyodide...
        </div>
      )}
      <header className="border-b relative z-20 py-3 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6 flex items-center w-full">
        <Logo className="h-auto w-8 mr-4" />
        <div className="font-bold text-xl">
          <a href="https://strawberry.rocks">Strawberry GraphQL</a> Playground
        </div>
        <div className="ml-auto">
          <Button>Share</Button>
        </div>
      </header>

      <Suspense fallback={<div>Loading...</div>}>
        <Playground
          defaultCode={snippet.code}
          defaultQuery={snippet.query}
          defaultVariables={snippet.variables}
        />
      </Suspense>

      <div className="border-t py-2 flex gap-4 px-4">
        <div
          className={clsx("ml-auto", {
            "animate-spin": loading,
          })}
        >
          {loading ? "⏳" : "✅"}
        </div>

        <div>
          <Suspense fallback={null}>
            <VersionSelector
              name="strawberry-graphql"
              defaultVersion={snippet.strawberryVersion}
              onVersionSelected={(version) => setCurrentVersion(version)}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default App;
