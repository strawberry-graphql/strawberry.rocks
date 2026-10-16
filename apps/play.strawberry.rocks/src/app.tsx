import { Logo } from "./components/logo";
import { Playground } from "./components/playground";
import { Share } from "./components/share";
import { PyodideProvider } from "./components/strawberry/pyodide";
import { usePyodide } from "./components/strawberry/pyodide-context";
import { ThemeToggle } from "./components/theme-toggle";
import { VersionSelector } from "./components/version-selector";
import type { EditorState } from "./editor-state";
import { useSnippet } from "./hooks/use-snippet";
import clsx from "clsx";
import { Suspense, useState } from "react";

function App() {
  const { snippet } = useSnippet();
  const [strawberryVersion, setStrawberryVersion] = useState(
    snippet.strawberryVersion
  );

  return (
    <PyodideProvider strawberryVersion={strawberryVersion}>
      <PlaygroundApp
        snippet={snippet}
        strawberryVersion={strawberryVersion}
        onStrawberryVersionChange={setStrawberryVersion}
      />
    </PyodideProvider>
  );
}

function PlaygroundApp({
  snippet,
  strawberryVersion,
  onStrawberryVersionChange,
}: {
  snippet: EditorState & { strawberryVersion: string };
  strawberryVersion: string;
  onStrawberryVersionChange: (version: string) => void;
}) {
  const { initializing, loading } = usePyodide();
  const [editorState, setEditorState] = useState<EditorState>({
    code: snippet.code,
    query: snippet.query,
    variables: snippet.variables,
  });

  return (
    <>
      {initializing && (
        <div className="absolute flex items-center justify-center bg-yellow-200/90 z-50 px-10 py-6 bottom-10 right-10">
          Loading pyodide...
        </div>
      )}
      <header className="border-b relative z-20 py-3 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6 flex items-center w-full dark:text-white dark:bg-dark">
        <Logo className="h-auto w-8 mr-4" />
        <div className="font-bold text-xl">
          <a href="https://strawberry.rocks" className="underline">
            Strawberry GraphQL
          </a>{" "}
          Playground
        </div>
        <div className="ml-auto flex gap-3">
          <Share state={editorState} version={strawberryVersion} />
          <ThemeToggle />
        </div>
      </header>

      <Suspense fallback={<div>Loading...</div>}>
        <Playground state={editorState} onChange={setEditorState} />
      </Suspense>

      <div className="border-t py-2 flex gap-4 px-4 dark:bg-dark">
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
              defaultVersion={strawberryVersion}
              onVersionSelected={onStrawberryVersionChange}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default App;
