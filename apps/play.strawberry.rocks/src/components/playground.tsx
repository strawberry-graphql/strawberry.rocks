import type { EditorState } from "../editor-state";
import { useGraphQLSchema } from "../hooks/use-graphql-schema";
import { useMediaQuery } from "../hooks/use-media-query";
import { DockLayout } from "./dock/dock-layout";
import type { PanelId } from "./dock/layout";
import {
  CodeEditor,
  type EditorInstance,
  type EditorMarker,
} from "./editor/editor";
import { consoleCount } from "./result/logs";
import {
  Count,
  ResponseView,
  ResultConsole,
  ResultHeaders,
  ResultPanel,
  ResultStatus,
  type ResultProps,
} from "./result/result-panel";
import { SchemaView } from "./schema/schema-view";
import { usePyodide } from "./strawberry/pyodide-context";
import type { ExecutionResult } from "./strawberry/pyodide-context";
import { Tabs, Tab } from "./tabs";
import type { DockviewApi } from "dockview-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const Playground = ({
  state,
  onChange,
  dockApiRef,
  revision,
}: {
  state: EditorState;
  onChange: React.Dispatch<React.SetStateAction<EditorState>>;
  /** Set once the desktop layout is ready, e.g. to reset it */
  dockApiRef: React.RefObject<DockviewApi | null>;
  /**
   * Changed when the code is replaced from outside, e.g. by an example. The
   * editors are uncontrolled, so they're created again with the new code
   */
  revision: number;
}) => {
  const { executeQuery, initializing } = usePyodide();
  const [{ result, error, duration }, setResult] = useState<{
    result: ExecutionResult | null;
    error: string | null;
    /** How long the last run took, in milliseconds */
    duration: number | null;
  }>({ result: null, error: null, duration: null });
  const latestRun = useRef(0);
  // Kept from the last successful run, so the schema explorer and query
  // autocompletion keep working while the code is being edited
  const [sdl, setSdl] = useState<string | null>(null);
  const schema = useGraphQLSchema(sdl);

  const runQuery = useDebouncedCallback(async (state: EditorState) => {
    const run = ++latestRun.current;
    const start = performance.now();

    const result = await executeQuery({
      schemaCode: state.code,
      query: state.query,
      variables: state.variables,
    });

    // Ignore results of runs that were superseded while executing
    if (run === latestRun.current) {
      setResult({ ...result, duration: performance.now() - start });

      if (result.result?.schema) {
        setSdl(result.result.schema);
      }
    }
    // Long enough to wait for a pause in typing, so half-written code
    // doesn't flash errors
  }, 500);

  useEffect(() => {
    if (!initializing) {
      runQuery(state);
    }
  }, [state, initializing, runQuery]);

  const codeEditor = useRef<EditorInstance | null>(null);
  const queryEditor = useRef<EditorInstance | null>(null);

  const jumpTo = (
    panel: PanelId,
    editor: EditorInstance | null,
    line: number,
    column = 1
  ) => {
    // The editor can be in a tab that isn't shown
    dockApiRef.current?.getPanel(panel)?.api.setActive();
    editor?.revealLineInCenter(line);
    editor?.setPosition({ lineNumber: line, column });
    // After dockview has moved focus to the newly shown tab
    requestAnimationFrame(() => editor?.focus());
  };

  const codeMarkers = useMemo(() => {
    const errors = [
      result?.error,
      ...(result?.logs ?? []).map((log) => log.error),
    ];

    return errors.flatMap((error): EditorMarker[] => {
      const location = error?.strawberry?.location;

      if (location) {
        return [
          {
            line: location.line,
            column: location.column,
            endColumn: location.end_column,
            message: error.strawberry!.annotation
              ? `${error.strawberry!.title}: ${error.strawberry!.annotation}`
              : error.strawberry!.title,
          },
        ];
      }

      return error?.line
        ? [{ line: error.line, message: `${error.type}: ${error.message}` }]
        : [];
    });
  }, [result]);

  const queryMarkers = useMemo(
    () =>
      (result?.response?.errors ?? []).flatMap((error) =>
        (error.locations ?? []).map(
          (location): EditorMarker => ({ ...location, message: error.message })
        )
      ),
    [result]
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const codeEditorElement = (
    <CodeEditor
      key={revision}
      source={state.code}
      onChange={(code) => onChange((state) => ({ ...state, code }))}
      language="python"
      markers={codeMarkers}
      onMount={(editor) => (codeEditor.current = editor)}
    />
  );
  const queryEditorElement = (
    <CodeEditor
      key={revision}
      source={state.query}
      onChange={(query) => onChange((state) => ({ ...state, query }))}
      language="graphql"
      markers={queryMarkers}
      onMount={(editor) => (queryEditor.current = editor)}
    />
  );
  const variablesEditorElement = (
    <CodeEditor
      key={revision}
      source={state.variables}
      onChange={(variables) => onChange((state) => ({ ...state, variables }))}
      language="json"
    />
  );
  const resultProps: ResultProps = {
    result,
    error,
    duration,
    schema,
    sdl,
    onJumpToCode: (line) => jumpTo("code", codeEditor.current, line),
    onJumpToQuery: (line, column) =>
      jumpTo("query", queryEditor.current, line, column),
  };

  // On small screens, show one pane at a time
  if (!isDesktop) {
    return (
      <Tabs className="h-full">
        <Tab title="schema.py">{codeEditorElement}</Tab>
        <Tab title="Query">{queryEditorElement}</Tab>
        <Tab title="Variables">{variablesEditorElement}</Tab>
        <Tab title="Result">
          <ResultPanel {...resultProps} />
        </Tab>
      </Tabs>
    );
  }

  return (
    <DockLayout
      panels={{
        code: codeEditorElement,
        query: queryEditorElement,
        variables: variablesEditorElement,
        response: <ResponseView {...resultProps} />,
        console: <ResultConsole {...resultProps} />,
        headers: <ResultHeaders {...resultProps} />,
        schema: <SchemaView schema={schema} sdl={sdl} />,
      }}
      badges={{ console: <Count count={consoleCount(result)} /> }}
      status={<ResultStatus {...resultProps} />}
      onReady={(api) => (dockApiRef.current = api)}
    />
  );
};
