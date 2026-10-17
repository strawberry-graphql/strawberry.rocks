import type { EditorState } from "../editor-state";
import { useGraphQLSchema } from "../hooks/use-graphql-schema";
import { useMediaQuery } from "../hooks/use-media-query";
import {
  CodeEditor,
  type EditorInstance,
  type EditorMarker,
} from "./editor/editor";
import { ResizeHandler } from "./resize-handler";
import { ResultPanel } from "./result/result-panel";
import { usePyodide } from "./strawberry/pyodide-context";
import type { ExecutionResult } from "./strawberry/pyodide-context";
import { Tabs, Tab } from "./tabs";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Panel } from "react-resizable-panels";
import { useDebouncedCallback } from "use-debounce";

export const Playground = ({
  state,
  onChange,
}: {
  state: EditorState;
  onChange: React.Dispatch<React.SetStateAction<EditorState>>;
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
  }, 100);

  useEffect(() => {
    if (!initializing) {
      runQuery(state);
    }
  }, [state, initializing, runQuery]);

  const codeEditor = useRef<EditorInstance | null>(null);
  const queryEditor = useRef<EditorInstance | null>(null);

  const jumpTo = (editor: EditorInstance | null, line: number, column = 1) => {
    editor?.revealLineInCenter(line);
    editor?.setPosition({ lineNumber: line, column });
    editor?.focus();
  };

  const codeMarkers = useMemo(() => {
    const errors = [
      result?.error,
      ...(result?.logs ?? []).map((log) => log.error),
    ];

    return errors.flatMap((error): EditorMarker[] =>
      error?.line
        ? [{ line: error.line, message: `${error.type}: ${error.message}` }]
        : []
    );
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
      source={state.code}
      onChange={(code) => onChange((state) => ({ ...state, code }))}
      language="python"
      markers={codeMarkers}
      onMount={(editor) => (codeEditor.current = editor)}
    />
  );
  const queryEditorElement = (
    <CodeEditor
      source={state.query}
      onChange={(query) => onChange((state) => ({ ...state, query }))}
      language="graphql"
      markers={queryMarkers}
      onMount={(editor) => (queryEditor.current = editor)}
    />
  );
  const variablesEditorElement = (
    <CodeEditor
      source={state.variables}
      onChange={(variables) => onChange((state) => ({ ...state, variables }))}
      language="json"
    />
  );
  const resultPanelElement = (
    <ResultPanel
      result={result}
      error={error}
      duration={duration}
      schema={schema}
      sdl={sdl}
      onJumpToCode={(line) => jumpTo(codeEditor.current, line)}
      onJumpToQuery={(line, column) =>
        jumpTo(queryEditor.current, line, column)
      }
    />
  );

  // On small screens, show one pane at a time
  if (!isDesktop) {
    return (
      <Tabs className="h-full">
        <Tab title="schema.py">{codeEditorElement}</Tab>
        <Tab title="Query">{queryEditorElement}</Tab>
        <Tab title="Variables">{variablesEditorElement}</Tab>
        <Tab title="Result">{resultPanelElement}</Tab>
      </Tabs>
    );
  }

  return (
    <Group orientation="horizontal" className="h-full">
      <Panel defaultSize="38%" minSize="20%">
        <Tabs className="h-full">
          <Tab title="schema.py">{codeEditorElement}</Tab>
        </Tabs>
      </Panel>
      <ResizeHandler />

      <Panel defaultSize="28%" minSize="20%">
        <Group orientation="vertical" className="h-full">
          <Panel defaultSize="65%" minSize="20%">
            <Tabs className="h-full">
              <Tab title="Query">{queryEditorElement}</Tab>
            </Tabs>
          </Panel>
          <ResizeHandler direction="vertical" />
          <Panel minSize="20%">
            <Tabs className="h-full">
              <Tab title="Variables">{variablesEditorElement}</Tab>
            </Tabs>
          </Panel>
        </Group>
      </Panel>
      <ResizeHandler />
      <Panel defaultSize="34%" minSize="20%">
        {resultPanelElement}
      </Panel>
    </Group>
  );
};
