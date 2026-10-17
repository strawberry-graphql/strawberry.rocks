import { useTheme } from "../theme-context";
import Editor, { useMonaco, type OnMount } from "@monaco-editor/react";
import { useEffect, useState } from "react";

export type EditorInstance = Parameters<OnMount>[0];

export type EditorMarker = {
  line: number;
  /** Underlines the word at this column, or the whole line when not set */
  column?: number;
  /** Underlines up to this column instead of to the end of the word */
  endColumn?: number;
  message: string;
};

export const CodeEditor = ({
  source,
  onChange,
  onMount,
  readOnly = false,
  language,
  markers,
}: {
  source: string;
  language: "python" | "graphql" | "json";
  readOnly?: boolean;
  onChange?: (source: string) => void;
  onMount?: (editor: EditorInstance) => void;
  markers?: EditorMarker[];
}) => {
  const { actualTheme } = useTheme();
  const monaco = useMonaco();
  const [editor, setEditor] = useState<EditorInstance | null>(null);

  useEffect(() => {
    const model = editor?.getModel();

    if (!monaco || !model) {
      return;
    }

    monaco.editor.setModelMarkers(
      model,
      "playground",
      (markers ?? [])
        .filter((marker) => marker.line <= model.getLineCount())
        .map((marker) => {
          if (marker.column && marker.endColumn) {
            return {
              severity: monaco.MarkerSeverity.Error,
              message: marker.message,
              startLineNumber: marker.line,
              endLineNumber: marker.line,
              startColumn: marker.column,
              endColumn: marker.endColumn,
            };
          }

          const word =
            marker.column &&
            model.getWordAtPosition({
              lineNumber: marker.line,
              column: marker.column,
            });

          return {
            severity: monaco.MarkerSeverity.Error,
            message: marker.message,
            startLineNumber: marker.line,
            endLineNumber: marker.line,
            startColumn: word
              ? word.startColumn
              : marker.column ??
                model.getLineFirstNonWhitespaceColumn(marker.line),
            endColumn: word
              ? word.endColumn
              : marker.column
              ? marker.column + 1
              : model.getLineMaxColumn(marker.line),
          };
        })
    );
  }, [monaco, editor, markers, source]);

  return (
    <Editor
      options={{
        automaticLayout: true,
        fixedOverflowWidgets: true,
        readOnly,
        minimap: { enabled: false },
        fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace",
        fontSize: 13,
        lineHeight: 20,
        padding: { top: 12 },
        lineNumbersMinChars: 3,
        renderLineHighlightOnlyWhenFocus: true,
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        roundedSelection: false,
        scrollBeyondLastLine: false,
        contextmenu: false,
      }}
      theme={actualTheme === "dark" ? "strawberry-dark" : "strawberry-light"}
      language={language}
      // Editable editors are uncontrolled: @monaco-editor/react replaces the
      // whole content whenever `value` differs from it, so a keystroke typed
      // before React re-renders would be undone and the cursor moved
      defaultValue={source}
      value={readOnly ? source : undefined}
      onChange={(value) => onChange?.(value ?? "")}
      onMount={(editor) => {
        setEditor(editor);
        onMount?.(editor);
      }}
    />
  );
};
