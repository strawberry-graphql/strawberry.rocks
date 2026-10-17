import { applyDefaultLayout } from "./components/dock/layout";
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
import type { DockviewApi } from "dockview-react";
import { LayoutPanelLeft } from "lucide-react";
import { Suspense, useRef, useState } from "react";

/** Like the separators in the strawberry.rocks header */
const Separator = () => (
  <div className="mx-1 hidden h-6 w-px shrink-0 bg-border sm:block" />
);

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
  const dockApiRef = useRef<DockviewApi | null>(null);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-3 sm:px-5">
        <a
          href="https://strawberry.rocks"
          className="flex shrink-0 items-center gap-2.5"
          title="Strawberry GraphQL"
        >
          <Logo className="h-9 w-auto" />
          <span className="hidden font-display text-xl font-bold tracking-tight sm:inline">
            Playground
          </span>
        </a>

        <Separator />

        <Suspense fallback={null}>
          <VersionSelector
            name="strawberry-graphql"
            defaultVersion={strawberryVersion}
            onVersionSelected={onStrawberryVersionChange}
          />
        </Suspense>

        <StatusIndicator />

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            title="Reset layout"
            aria-label="Reset layout"
            onClick={() =>
              dockApiRef.current && applyDefaultLayout(dockApiRef.current)
            }
          >
            <LayoutPanelLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            asChild
            className="hidden text-foreground md:inline-flex"
          >
            <a href="https://strawberry.rocks/docs">Docs</a>
          </Button>
          <Share state={editorState} version={strawberryVersion} />
          <Separator />
          <ThemeToggle />
        </div>
      </header>

      <main className="min-h-0 flex-1">
        <Playground
          state={editorState}
          onChange={setEditorState}
          dockApiRef={dockApiRef}
        />
      </main>
    </>
  );
}

export default App;
