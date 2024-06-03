import { TOMORROW, TOMORROW_NIGHT } from "./theme";
import { Monaco } from "@monaco-editor/react";

export function setupMonaco(monaco: Monaco) {
  monaco.editor.defineTheme("Tomorrow", TOMORROW as any);
  monaco.editor.defineTheme("TomorrowNight", TOMORROW_NIGHT as any);
}
