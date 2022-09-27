import json5 from "json5";
import parseNumericRange from "parse-numeric-range";
import { visit } from "unist-util-visit";
import shiki from "shiki";

const highlighter = await shiki.getHighlighter({ theme: "poimandres" });

export function remarkShiki(options = {}) {
  const parseMeta = options.parseMeta || parseMetaDefault;

  const loadedLanguages = highlighter.getLoadedLanguages();
  const ignoreUnknownLanguage =
    options.ignoreUnknownLanguage == null
      ? true
      : options.ignoreUnknownLanguage;

  return transformer;

  function transformer(tree) {
    visit(tree, "code", visitor);

    function visitor(node) {
      const lang =
        ignoreUnknownLanguage && !loadedLanguages.includes(node.lang)
          ? null
          : node.lang;

      const lineOptions = parseMeta(node.meta, node);
      const comments = [];

      let lines = node.value.split("\n").filter((text, line) => {
        if (text.trim().startsWith("#") && text.includes("^^")) {
          comments.push([text, line]);

          return false;
        }

        return true;
      });

      console.log(comments);

      let code = lines.join("\n");

      const highlighted = highlighter.codeToHtml(code, {
        lang,
        lineOptions,
      });

      console.log(highlighted);

      node.type = "html";
      node.value = highlighted;
    }
  }
}

// function codeToHtml(code, arg1 = "text", arg2) {
//     let options2;
//     if (typeof arg1 === "object") {
//       options2 = arg1;
//     } else {
//       options2 = {
//         lang: arg1,
//         theme: arg2
//       };
//     }
//     const tokens = codeToThemedTokens(code, options2.lang, options2.theme, {
//       includeExplanation: false
//     });
//     const { _theme } = getTheme(options2.theme);
//     return renderToHtml(tokens, {
//       fg: _theme.fg,
//       bg: _theme.bg,
//       lineOptions: options2 == null ? void 0 : options2.lineOptions
//     });
//   }

function parseMetaDefault(meta) {
  if (meta == null) return undefined;
  if (meta.length === 0) return undefined;

  try {
    const parsed = json5.parse(meta);
    if (parsed.highlight != null) {
      const highlighted = parseNumericRange(parsed.highlight);
      return highlighted.map((line) => {
        return { line, classes: ["highlighted-line"] };
      });
    }
    return undefined;
  } catch {
    return undefined;
  }
}
