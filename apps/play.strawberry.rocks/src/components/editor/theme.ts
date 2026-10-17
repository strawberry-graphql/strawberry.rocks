import type { ThemeData } from "./setup-monaco";

// The code colors of strawberry.rocks, see --code-color-* in the site's
// global.css. Monaco's tokenizers produce names like `keyword.python`, which
// match these rules by prefix
const DARK_CODE = {
  text: "e2e2e3",
  green: "8ed287",
  blue: "aed5fb",
  purple: "cbabf9",
  pink: "ea8075",
  orange: "eaad75",
  muted: "8b8b8d",
};

// Darker versions of the same colors, readable on white
const LIGHT_CODE = {
  text: "0d0e12",
  green: "16794f",
  blue: "1764b0",
  purple: "7a3fd1",
  pink: "c2453a",
  orange: "b25d0e",
  muted: "6f7073",
};

const rules = (code: typeof DARK_CODE): ThemeData["rules"] => [
  { token: "", foreground: code.text },
  { token: "comment", foreground: code.pink },
  { token: "keyword", foreground: code.green },
  { token: "string", foreground: code.blue },
  { token: "string.key.json", foreground: code.purple },
  { token: "string.escape", foreground: code.orange },
  { token: "number", foreground: code.orange },
  // Python decorators
  { token: "tag", foreground: code.orange },
  { token: "type.identifier", foreground: code.purple },
  { token: "annotation", foreground: code.orange },
  { token: "argument.identifier", foreground: code.orange },
  { token: "delimiter", foreground: code.muted },
  { token: "operator", foreground: code.muted },
];

// Brackets are punctuation on strawberry.rocks, instead of Monaco's
// rainbow of nesting levels
const brackets = (color: string) =>
  Object.fromEntries(
    [1, 2, 3, 4, 5, 6].map((level) => [
      `editorBracketHighlight.foreground${level}`,
      `#${color}`,
    ])
  );

export const STRAWBERRY_DARK: ThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: rules(DARK_CODE),
  colors: {
    "editor.foreground": `#${DARK_CODE.text}`,
    "editor.background": "#0d0e12",
    "editor.selectionBackground": "#3a2a33",
    "editor.inactiveSelectionBackground": "#2a2023",
    "editor.lineHighlightBackground": "#16171c",
    "editor.lineHighlightBorder": "#00000000",
    "editorLineNumber.foreground": "#515254",
    "editorLineNumber.activeForeground": "#c5c5c6",
    "editorGutter.background": "#0d0e12",
    "editorCursor.foreground": "#f7393d",
    "editorWhitespace.foreground": "#28292c",
    "editorIndentGuide.background1": "#1f1f1f",
    "editorIndentGuide.activeBackground1": "#515254",
    "editorWidget.background": "#1f1f1f",
    "editorWidget.border": "#28292c",
    "editorSuggestWidget.background": "#1f1f1f",
    "editorSuggestWidget.border": "#28292c",
    "editorSuggestWidget.selectedBackground": "#28292c",
    "editorHoverWidget.background": "#1f1f1f",
    "editorHoverWidget.border": "#28292c",
    ...brackets(DARK_CODE.purple),
  },
};

export const STRAWBERRY_LIGHT: ThemeData = {
  base: "vs",
  inherit: true,
  rules: rules(LIGHT_CODE),
  colors: {
    "editor.foreground": `#${LIGHT_CODE.text}`,
    "editor.background": "#ffffff",
    "editor.selectionBackground": "#fdd7d8",
    "editor.inactiveSelectionBackground": "#feeaea",
    "editor.lineHighlightBackground": "#f7f7f8",
    "editor.lineHighlightBorder": "#00000000",
    "editorLineNumber.foreground": "#c5c5c6",
    "editorLineNumber.activeForeground": "#515254",
    "editorCursor.foreground": "#f7393d",
    "editorWhitespace.foreground": "#e2e2e3",
    "editorIndentGuide.background1": "#f0f1f1",
    "editorIndentGuide.activeBackground1": "#c5c5c6",
    ...brackets(LIGHT_CODE.purple),
  },
};
