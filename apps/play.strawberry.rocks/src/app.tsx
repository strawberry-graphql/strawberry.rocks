import { applyDefaultLayout } from "./components/dock/layout";
import { ExamplesMenu } from "./components/examples-menu";
import { Logo } from "./components/logo";
import { Playground } from "./components/playground";
import { Share } from "./components/share";
import { StatusBar } from "./components/status-bar";
import { PyodideProvider } from "./components/strawberry/pyodide";
import { ThemeToggle } from "./components/theme-toggle";
import { Button } from "./components/ui/button";
import type { EditorState } from "./editor-state";
import type { Example } from "./examples";
import { useSnippet } from "./hooks/use-snippet";
import type { DockviewApi } from "dockview-react";
import { LayoutPanelLeft } from "lucide-react";
import { useRef, useState } from "react";

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
    headers: snippet.headers,
  });
  const dockApiRef = useRef<DockviewApi | null>(null);
  const [revision, setRevision] = useState(0);
  // What the editors had when last loaded, to know if there are edits to lose
  const [loadedState, setLoadedState] = useState(editorState);

  const loadExample = (example: Example) => {
    const hasEdits =
      editorState.code !== loadedState.code ||
      editorState.query !== loadedState.query ||
      editorState.variables !== loadedState.variables ||
      editorState.headers !== loadedState.headers;

    if (
      hasEdits &&
      !window.confirm(`Replace your code with the “${example.title}” example?`)
    ) {
      return;
    }

    const state = {
      code: example.code,
      query: example.query,
      variables: example.variables,
      headers: example.headers,
    };

    setEditorState(state);
    setLoadedState(state);
    setRevision((revision) => revision + 1);
    // So the page can be reloaded or linked to
    window.history.replaceState(null, "", `?example=${example.slug}`);
  };

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-3 sm:px-5">
        <a
          href="https://strawberry.rocks"
          className="flex shrink-0 items-center gap-2.5"
          title="Strawberry GraphQL"
        >
          <Logo className="h-9 w-auto" />
          <span className="font-display text-lg font-bold tracking-tight sm:text-xl">
            Playground
          </span>
        </a>

        <nav className="ml-auto flex items-center gap-1">
          <ExamplesMenu onSelect={loadExample} />
          <Button
            variant="ghost"
            asChild
            className="hidden text-foreground md:inline-flex"
          >
            <a href="https://strawberry.rocks/docs">Docs</a>
          </Button>
        </nav>

        <Separator />

        <div className="flex items-center gap-1">
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
          <ThemeToggle />
        </div>

        <Share state={editorState} version={strawberryVersion} />
      </header>

      <main className="min-h-0 flex-1">
        <Playground
          state={editorState}
          onChange={setEditorState}
          dockApiRef={dockApiRef}
          revision={revision}
        />
      </main>

      <StatusBar
        strawberryVersion={strawberryVersion}
        onStrawberryVersionChange={onStrawberryVersionChange}
      />
    </>
  );
}

export default App;
