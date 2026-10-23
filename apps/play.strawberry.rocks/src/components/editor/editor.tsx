import { useTheme } from "../theme-context";
import Editor, { useMonaco, type OnMount } from "@monaco-editor/react";
import { useEffect, useEffectEvent, useState } from "react";

export type EditorInstance = Parameters<OnMount>[0];

export type EditorMarker = {
  line: number;
  /** Underlines the word at this column, or the whole line when not set */
  column?: number;
  /** Underlines up to this column instead of to the end of the word */
  endColumn?: number;
  message: string;
};

let overflowWidgetsNode: HTMLElement | null = null;

/**
 * Suggestions, hovers and other popups are rendered here, outside the editor,
 * so the panels don't clip them. It has to be outside the dock as well: its
 * panes use transforms, which would offset the popups' fixed positions
 */
function getOverflowWidgetsNode() {
  if (!overflowWidgetsNode) {
    overflowWidgetsNode = document.createElement("div");
    // Monaco's theme variables and styles apply inside .monaco-editor
    overflowWidgetsNode.className = "monaco-editor";
    overflowWidgetsNode.style.zIndex = "50";
    document.body.appendChild(overflowWidgetsNode);
  }

  return overflowWidgetsNode;
}

export const CodeEditor = ({
  source,
  onChange,
  onMount,
  readOnly = false,
  language,
  markers,
  revision,
}: {
  source: string;
  /**
   * Changed when `source` is replaced from outside, e.g. by an example, to
   * update the editor without creating it again
   */
  revision?: number;
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

  const replaceSource = useEffectEvent(() => {
    const model = editor?.getModel();

    if (!editor || !model || readOnly || model.getValue() === source) {
      return;
    }

    // As an edit, so it can be undone
    editor.pushUndoStop();
    editor.executeEdits("playground", [
      { range: model.getFullModelRange(), text: source },
    ]);
    editor.pushUndoStop();
  });

  useEffect(() => {
    replaceSource();
  }, [revision]);

  return (
    <Editor
      options={{
        automaticLayout: true,
        fixedOverflowWidgets: true,
        overflowWidgetsDomNode: getOverflowWidgetsNode(),
        readOnly,
        minimap: { enabled: false },
        fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace",
        fontSize: 14,
        lineHeight: 22,
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
