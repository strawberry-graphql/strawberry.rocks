import { applyDefaultLayout } from "./components/dock/layout";
import { ExamplesMenu } from "./components/examples-menu";
import { Logo } from "./components/logo";
import { Playground } from "./components/playground";
import { Share } from "./components/share";
import { StatusBar } from "./components/status-bar";
import { PyodideProvider } from "./components/strawberry/pyodide";
import { ThemeToggle } from "./components/theme-toggle";
import { LessonView, TutorialNav } from "./components/tutorial/lesson-view";
import { Button } from "./components/ui/button";
import type { EditorState } from "./editor-state";
import { DEFAULT_EXAMPLE, findExample, type Example } from "./examples";
import { useSnippet } from "./hooks/use-snippet";
import { findLesson, lessonPath, LESSONS, type Lesson } from "./tutorial";
import clsx from "clsx";
import type { DockviewApi } from "dockview-react";
import { GraduationCap, LayoutPanelLeft } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";

const isSameState = (a: EditorState, b: EditorState) =>
  a.code.trim() === b.code.trim() &&
  a.query.trim() === b.query.trim() &&
  a.variables.trim() === b.variables.trim() &&
  a.headers.trim() === b.headers.trim();

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
  // e.g. /tutorial/welcome, null outside of the tutorial
  const [lesson, setLesson] = useState(() =>
    findLesson(window.location.pathname)
  );
  const [editorState, setEditorState] = useState<EditorState>(
    () =>
      lesson?.start ?? {
        code: snippet.code,
        query: snippet.query,
        variables: snippet.variables,
        headers: snippet.headers,
      }
  );
  const dockApiRef = useRef<DockviewApi | null>(null);
  const [revision, setRevision] = useState(0);
  // What the editors had when last loaded, to know if there are edits to lose
  const [loadedState, setLoadedState] = useState(editorState);
  // Edits to the lessons visited, so going back to one doesn't lose them
  const lessonEdits = useRef(new Map<string, EditorState>());

  const hasEdits = !isSameState(editorState, loadedState);

  const loadState = (state: EditorState) => {
    setEditorState(state);
    setLoadedState(state);
    setRevision((revision) => revision + 1);
  };

  const loadExample = (example: Example) => {
    if (
      hasEdits &&
      !lesson &&
      !window.confirm(`Replace your code with the “${example.title}” example?`)
    ) {
      return;
    }

    if (lesson) {
      lessonEdits.current.set(lesson.slug, editorState);
    }

    loadState({
      code: example.code,
      query: example.query,
      variables: example.variables,
      headers: example.headers,
    });
    setLesson(null);
    // So the page can be reloaded or linked to
    window.history.pushState(null, "", `/?example=${example.slug}`);
  };

  const openLesson = (next: Lesson, { push = true } = {}) => {
    if (
      hasEdits &&
      !lesson &&
      !window.confirm("Replace your code with the tutorial?")
    ) {
      return;
    }

    if (lesson) {
      lessonEdits.current.set(lesson.slug, editorState);
    }

    loadState(lessonEdits.current.get(next.slug) ?? next.start);
    setLesson(next);

    if (push) {
      window.history.pushState(null, "", lessonPath(next));
    }
  };

  // /tutorial and unknown lessons show the first lesson, so the URL should
  // say so
  useEffect(() => {
    if (lesson && window.location.pathname !== lessonPath(lesson)) {
      window.history.replaceState(null, "", lessonPath(lesson));
    }
  }, [lesson]);

  // Going back and forward between lessons, or out of the tutorial
  const onPopState = useEffectEvent(() => {
    const next = findLesson(window.location.pathname);

    if (next) {
      openLesson(next, { push: false });
    } else if (lesson) {
      lessonEdits.current.set(lesson.slug, editorState);
      const params = new URLSearchParams(window.location.search);
      const example = findExample(params.get("example")) ?? DEFAULT_EXAMPLE;

      loadState({
        code: example.code,
        query: example.query,
        variables: example.variables,
        headers: example.headers,
      });
      setLesson(null);
    }
  });

  useEffect(() => {
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-3 sm:px-5">
        <a
          href="https://strawberry.rocks"
          className="flex shrink-0 items-center gap-2.5"
          title="Strawberry GraphQL"
        >
          <Logo className="h-9 w-auto" />
          <span
            className={clsx(
              "font-display text-lg font-bold tracking-tight sm:text-xl",
              // Leaves room for the lesson navigation
              lesson && "hidden sm:inline"
            )}
          >
            {lesson ? "Tutorial" : "Playground"}
          </span>
        </a>

        {lesson ? (
          <>
            <Separator />
            <TutorialNav lesson={lesson} onNavigate={openLesson} />
          </>
        ) : null}

        <nav className="ml-auto flex items-center gap-1">
          {lesson ? (
            lesson.solution ? (
              <Button
                variant="ghost"
                className="border border-strawberry/50 px-3 text-strawberry hover:bg-strawberry/10 hover:text-strawberry"
                onClick={() =>
                  loadState(
                    isSameState(editorState, lesson.solution!)
                      ? lesson.start
                      : lesson.solution!
                  )
                }
              >
                {isSameState(editorState, lesson.solution) ? "Reset" : "Solve"}
              </Button>
            ) : null
          ) : (
            <Button
              variant="ghost"
              asChild
              className="px-2 text-foreground sm:px-3"
            >
              <a
                href="/tutorial"
                aria-label="Tutorial"
                onClick={(event) => {
                  event.preventDefault();
                  openLesson(LESSONS[0]);
                }}
              >
                <GraduationCap className="sm:hidden" />
                <span className="hidden sm:inline">Tutorial</span>
              </a>
            </Button>
          )}
          <div className={clsx(lesson && "hidden md:block")}>
            <ExamplesMenu onSelect={loadExample} />
          </div>
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
              dockApiRef.current &&
              applyDefaultLayout(
                dockApiRef.current,
                lesson ? "tutorial" : "playground"
              )
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
          lesson={
            lesson ? (
              <LessonView lesson={lesson} onNavigate={openLesson} />
            ) : undefined
          }
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
