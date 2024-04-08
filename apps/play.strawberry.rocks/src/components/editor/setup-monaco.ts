import { Monaco } from "@monaco-editor/react";
import { TOMORROW } from "./theme";

export function setupMonaco(monaco: Monaco) {
    monaco.editor.defineTheme("Tomorrow", TOMORROW);
}
