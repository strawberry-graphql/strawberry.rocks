import { TOMORROW, TOMORROW_NIGHT } from "./theme";
import type { Monaco } from "@monaco-editor/react";

export type ThemeData = Parameters<Monaco["editor"]["defineTheme"]>[1];

export function setupMonaco(monaco: Monaco) {
  monaco.editor.defineTheme("Tomorrow", TOMORROW);
  monaco.editor.defineTheme("TomorrowNight", TOMORROW_NIGHT);
}
