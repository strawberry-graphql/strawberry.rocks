import { useTheme } from "../theme-context";
import Editor, { useMonaco, type OnMount } from "@monaco-editor/react";
import { useEffect, useState } from "react";

export type EditorInstance = Parameters<OnMount>[0];

export type EditorMarker = {
  line: number;
  /** Underlines the word at this column, or the whole line when not set */
  column?: number;
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
        fontSize: 14,
        roundedSelection: false,
        scrollBeyondLastLine: false,
        contextmenu: false,
      }}
      theme={actualTheme === "dark" ? "TomorrowNight" : "Tomorrow"}
      language={language}
      value={source}
      onChange={(value) => onChange?.(value ?? "")}
      onMount={(editor) => {
        setEditor(editor);
        onMount?.(editor);
      }}
    />
  );
};
