import { TOMORROW } from "./theme";
import { Monaco } from "@monaco-editor/react";

export function setupMonaco(monaco: Monaco) {
  monaco.editor.defineTheme("Tomorrow", TOMORROW);
}
