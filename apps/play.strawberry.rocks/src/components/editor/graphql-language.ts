import type { Monaco } from "@monaco-editor/react";
import type { GraphQLSchema } from "graphql";
import {
  getAutocompleteSuggestions,
  getHoverInformation,
  Position,
} from "graphql-language-service";

// The schema of the last successful run, used for completions and hovers
let currentSchema: GraphQLSchema | null = null;

export const setGraphQLSchema = (schema: GraphQLSchema | null) => {
  currentSchema = schema;
};

// graphql-language-service uses LSP completion kinds, which are numbered
// differently from Monaco's
const LSP_COMPLETION_KINDS = [
  "Text",
  "Method",
  "Function",
  "Constructor",
  "Field",
  "Variable",
  "Class",
  "Interface",
  "Module",
  "Property",
  "Unit",
  "Value",
  "Enum",
  "Keyword",
  "Snippet",
  "Color",
  "File",
  "Reference",
  "Folder",
  "EnumMember",
  "Constant",
  "Struct",
  "Event",
  "Operator",
  "TypeParameter",
] as const;

// LSP's insertTextFormat for snippets, e.g. `field(arg: $1)`
const SNIPPET_FORMAT = 2;

export function registerGraphQLLanguage(monaco: Monaco) {
  const toPosition = (position: { lineNumber: number; column: number }) =>
    new Position(position.lineNumber - 1, position.column - 1);

  monaco.languages.registerCompletionItemProvider("graphql", {
    // Not `{`, space or newline: Enter would then accept a suggestion
    // (usually `__typename`) instead of starting a new line. Typing a
    // letter or Ctrl+Space still shows the field suggestions
    triggerCharacters: ["(", "$", "@"],
    provideCompletionItems(model, position) {
      if (!currentSchema) {
        return { suggestions: [] };
      }

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const items = getAutocompleteSuggestions(
        currentSchema,
        model.getValue(),
        toPosition(position)
      );

      return {
        suggestions: items.map((item) => {
          const kind = item.kind
            ? LSP_COMPLETION_KINDS[item.kind - 1]
            : undefined;

          return {
            label: item.label,
            // Introspection fields like `__typename` after the schema's own
            sortText: `${item.label.startsWith("__") ? 1 : 0}${item.label}`,
            kind: monaco.languages.CompletionItemKind[kind ?? "Field"],
            detail: item.detail ?? undefined,
            documentation: item.documentation
              ? { value: item.documentation }
              : undefined,
            tags: item.isDeprecated
              ? [monaco.languages.CompletionItemTag.Deprecated]
              : undefined,
            insertText: item.insertText ?? item.label,
            insertTextRules:
              item.insertTextFormat === SNIPPET_FORMAT
                ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                : undefined,
            command: item.command
              ? { id: item.command.command, title: item.command.title }
              : undefined,
            range,
          };
        }),
      };
    },
  });

  monaco.languages.registerHoverProvider("graphql", {
    provideHover(model, position) {
      if (!currentSchema) {
        return null;
      }

      const contents = getHoverInformation(
        currentSchema,
        model.getValue(),
        toPosition(position),
        undefined,
        { useMarkdown: true }
      );
      const values = (Array.isArray(contents) ? contents : [contents]).map(
        (content) => (typeof content === "string" ? content : content.value)
      );

      if (!values.some((value) => value.trim())) {
        return null;
      }

      return { contents: values.map((value) => ({ value })) };
    },
  });
}
