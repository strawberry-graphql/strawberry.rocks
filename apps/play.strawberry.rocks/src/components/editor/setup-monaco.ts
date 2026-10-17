import { registerGraphQLLanguage } from "./graphql-language";
import { STRAWBERRY_DARK, STRAWBERRY_LIGHT } from "./theme";
import type { Monaco } from "@monaco-editor/react";

export type ThemeData = Parameters<Monaco["editor"]["defineTheme"]>[1];

export function setupMonaco(monaco: Monaco) {
  monaco.editor.defineTheme("strawberry-light", STRAWBERRY_LIGHT);
  monaco.editor.defineTheme("strawberry-dark", STRAWBERRY_DARK);

  registerGraphQLLanguage(monaco);
}
