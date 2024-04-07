import Editor, { BeforeMount, Monaco } from "@monaco-editor/react";
import { useCallback, useRef } from "react";

export const CodeEditor = ({
    source,
    onChange,
    readOnly = false,
    language,
}: {
    source: string;
    language: "python" | "graphql" | "json";
    onChange?: (pythonSource: string) => void;
}) => {
    const monacoRef = useRef<Monaco | null>(null);
    const monaco = monacoRef.current;

    const handleChange = useCallback(
        (value: string | undefined) => {
            onChange(value ?? "");
        },
        [onChange],
    );

    const handleMount: BeforeMount = useCallback(
        (instance) => (monacoRef.current = instance),
        [],
    );

    return (
        <Editor
            beforeMount={handleMount}
            options={{
                fixedOverflowWidgets: true,
                readOnly,
                minimap: { enabled: false },
                fontSize: 14,
                roundedSelection: false,
                scrollBeyondLastLine: false,
                contextmenu: false,
            }}
            language={language}
            value={source}
            onChange={handleChange}
        />
    );
};
