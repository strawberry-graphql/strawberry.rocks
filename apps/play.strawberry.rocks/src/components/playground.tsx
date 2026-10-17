import type { EditorState } from "../editor-state";
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
  const [{ result, error }, setResult] = useState<{
    result: ExecutionResult | null;
    error: string | null;
  }>({ result: null, error: null });
  const latestRun = useRef(0);

  const runQuery = useDebouncedCallback(async (state: EditorState) => {
    const run = ++latestRun.current;

    const result = await executeQuery({
      schemaCode: state.code,
      query: state.query,
      variables: state.variables,
    });

    // Ignore results of runs that were superseded while executing
    if (run === latestRun.current) {
      setResult(result);
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

  return (
    <Group orientation="horizontal" className="h-full">
      <Panel minSize="20%">
        <Tabs className="h-full">
          <Tab title="Code">
            <CodeEditor
              source={state.code}
              onChange={(code) => {
                onChange((state) => ({ ...state, code }));
              }}
              language="python"
              markers={codeMarkers}
              onMount={(editor) => (codeEditor.current = editor)}
            />
          </Tab>
        </Tabs>
      </Panel>
      <ResizeHandler />

      <Panel minSize="20%">
        <Group orientation="vertical" className="h-full">
          <Panel minSize="20%">
            <Tabs className="h-full">
              <Tab title="Query">
                <CodeEditor
                  source={state.query}
                  onChange={(query) => {
                    onChange((state) => ({ ...state, query }));
                  }}
                  language="graphql"
                  markers={queryMarkers}
                  onMount={(editor) => (queryEditor.current = editor)}
                />
              </Tab>
            </Tabs>
          </Panel>
          <ResizeHandler direction="vertical" />
          <Panel minSize="20%">
            <Tabs className="h-full">
              <Tab title="Variables">
                <CodeEditor
                  source={state.variables}
                  onChange={(variables) => {
                    onChange((state) => ({ ...state, variables }));
                  }}
                  language="json"
                />
              </Tab>
            </Tabs>
          </Panel>
        </Group>
      </Panel>
      <ResizeHandler />
      <Panel minSize="20%">
        <ResultPanel
          result={result}
          error={error}
          onJumpToCode={(line) => jumpTo(codeEditor.current, line)}
          onJumpToQuery={(line, column) =>
            jumpTo(queryEditor.current, line, column)
          }
        />
      </Panel>
    </Group>
  );
};
