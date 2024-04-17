import Editor, { BeforeMount, Monaco, OnMount } from "@monaco-editor/react";
import { useCallback, useRef, useEffect } from "react";

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
  const monacoRef = useRef<any | null>(null);
  const monaco = monacoRef.current;

  const handleChange = useCallback(
    (value: string | undefined) => {
      onChange?.(value ?? "");
    },
    [onChange]
  );

  const handleMount: OnMount = useCallback(
    (instance) => (monacoRef.current = instance),
    []
  );

  useEffect(() => {
    const listener = () => {
      if (!monaco) {
        return;
      }

      const parent = monaco.getDomNode().parentElement;

      // make editor as small as possible
      monaco.layout({ width: 0, height: 0 });

      // wait for next frame to ensure last layout finished
      window.requestAnimationFrame(() => {
        // get the parent dimensions and re-layout the editor
        const rect = parent.getBoundingClientRect();
        monaco.layout({ width: rect.width, height: rect.height });
      });
    };

    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [monaco]);

  return (
    <Editor
      onMount={handleMount}
      options={{
        fixedOverflowWidgets: true,
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        roundedSelection: false,
        scrollBeyondLastLine: false,
        contextmenu: false,
      }}
      theme="Tomorrow"
      language={language}
      value={source}
      onChange={handleChange}
    />
  );
};
