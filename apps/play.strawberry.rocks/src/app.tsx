import { Logo } from "./components/logo";
import { Playground } from "./components/playground";
import { Share } from "./components/share";
import { StatusIndicator } from "./components/status-indicator";
import { PyodideProvider } from "./components/strawberry/pyodide";
import { ThemeToggle } from "./components/theme-toggle";
import { Button } from "./components/ui/button";
import { VersionSelector } from "./components/version-selector";
import type { EditorState } from "./editor-state";
import { useSnippet } from "./hooks/use-snippet";
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
  const [editorState, setEditorState] = useState<EditorState>({
    code: snippet.code,
    query: snippet.query,
    variables: snippet.variables,
  });

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-3 border-b bg-chrome px-3 sm:px-4">
        <a
          href="https://strawberry.rocks"
          className="flex shrink-0 items-center gap-2"
        >
          <Logo className="h-6 w-auto" />
          <span className="font-semibold tracking-tight">Strawberry</span>
        </a>
        <span className="-ml-1 hidden font-medium text-muted-foreground sm:inline">
          Playground
        </span>

        <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

        <Suspense fallback={null}>
          <VersionSelector
            name="strawberry-graphql"
            defaultVersion={strawberryVersion}
            onVersionSelected={onStrawberryVersionChange}
          />
        </Suspense>

        <StatusIndicator />

        <div className="ml-auto flex items-center gap-1.5">
          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <a href="https://strawberry.rocks/docs">Docs</a>
          </Button>
          <Share state={editorState} version={strawberryVersion} />
          <ThemeToggle />
        </div>
      </header>

      <main className="min-h-0 flex-1">
        <Playground state={editorState} onChange={setEditorState} />
      </main>
    </>
  );
}

export default App;
