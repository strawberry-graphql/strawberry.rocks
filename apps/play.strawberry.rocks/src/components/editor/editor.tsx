import { useTheme } from "../theme-context";
import Editor from "@monaco-editor/react";

export const CodeEditor = ({
  source,
  onChange,
  readOnly = false,
  language,
}: {
  source: string;
  language: "python" | "graphql" | "json";
  readOnly?: boolean;
  onChange?: (source: string) => void;
}) => {
  const { actualTheme } = useTheme();

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
    />
  );
};
